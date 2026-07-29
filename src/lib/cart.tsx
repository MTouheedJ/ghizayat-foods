import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";

import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "./site";
import type { CartLine, Product, Variant } from "./types";

const STORAGE_KEY = "ghizayat.cart.v1";
const MAX_QTY = 99;

type CartState = {
  lines: CartLine[];
  /** False until localStorage has been read — guards against hydration drift. */
  isReady: boolean;
};

type CartAction =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; line: CartLine }
  | { type: "remove"; variantId: string }
  | { type: "setQuantity"; variantId: string; quantity: number }
  | { type: "clear" };

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    // Hydration also flips isReady, so the whole "cart loaded" transition is a
    // single dispatch rather than a setState inside an effect.
    case "hydrate":
      return { lines: action.lines, isReady: true };

    case "add": {
      const existing = state.lines.find(
        (line) => line.variantId === action.line.variantId,
      );
      if (!existing) return { ...state, lines: [...state.lines, action.line] };

      return {
        ...state,
        lines: state.lines.map((line) =>
          line.variantId === action.line.variantId
            ? {
                ...line,
                quantity: Math.min(
                  MAX_QTY,
                  line.quantity + action.line.quantity,
                ),
              }
            : line,
        ),
      };
    }

    case "remove":
      return {
        ...state,
        lines: state.lines.filter((line) => line.variantId !== action.variantId),
      };

    case "setQuantity": {
      if (action.quantity <= 0) {
        return {
          ...state,
          lines: state.lines.filter(
            (line) => line.variantId !== action.variantId,
          ),
        };
      }
      return {
        ...state,
        lines: state.lines.map((line) =>
          line.variantId === action.variantId
            ? { ...line, quantity: Math.min(MAX_QTY, action.quantity) }
            : line,
        ),
      };
    }

    case "clear":
      return { ...state, lines: [] };

    default:
      return state;
  }
}

type CartContextValue = {
  lines: CartLine[];
  /** False until localStorage has been read — guards against hydration drift. */
  isReady: boolean;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  freeDeliveryRemaining: number;
  addItem: (product: Product, variant: Variant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
  /** Rising counter the header badge animates off. */
  lastAddedAt: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Defensive: a stale schema shouldn't crash the whole storefront.
    return parsed.filter(
      (line): line is CartLine =>
        typeof line === "object" &&
        line !== null &&
        typeof (line as CartLine).variantId === "string" &&
        typeof (line as CartLine).price === "number",
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    lines: [],
    isReady: false,
  });
  const [lastAddedAt, setLastAddedAt] = useState(0);
  const { isReady } = state;

  // Read persisted cart after mount so SSR and first client render match.
  useEffect(() => {
    dispatch({ type: "hydrate", lines: readStorage() });
  }, []);

  useEffect(() => {
    if (!isReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // Private browsing or a full quota — the cart still works in-memory.
    }
  }, [state.lines, isReady]);

  const addItem = useCallback(
    (product: Product, variant: Variant, quantity = 1) => {
      dispatch({
        type: "add",
        line: {
          productId: product.id,
          productSlug: product.slug,
          productTitle: product.title,
          variantId: variant.id,
          variantLabel: variant.label,
          grams: variant.grams,
          price: variant.price,
          quantity,
          image: product.images[0] ?? null,
        },
      });
      setLastAddedAt((value) => value + 1);
    },
    [],
  );

  const removeItem = useCallback((variantId: string) => {
    dispatch({ type: "remove", variantId });
  }, []);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    dispatch({ type: "setQuantity", variantId, quantity });
  }, []);

  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = state.lines.reduce(
      (sum, line) => sum + line.price * line.quantity,
      0,
    );
    const itemCount = state.lines.reduce((sum, line) => sum + line.quantity, 0);
    const qualifiesFree = subtotal >= FREE_DELIVERY_THRESHOLD;
    const deliveryFee = subtotal === 0 || qualifiesFree ? 0 : DELIVERY_FEE;

    return {
      lines: state.lines,
      isReady,
      itemCount,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      freeDeliveryRemaining: Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal),
      addItem,
      removeItem,
      setQuantity,
      clear,
      lastAddedAt,
    };
  }, [
    state.lines,
    isReady,
    addItem,
    removeItem,
    setQuantity,
    clear,
    lastAddedAt,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return context;
}
