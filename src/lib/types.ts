/**
 * Shared domain types.
 *
 * These are the ONLY shapes the UI knows about. Both the Sanity adapter and
 * the demo-data adapter normalise into them, so swapping the data source
 * never touches a component.
 */

export type ProductImage = {
  /** Absolute URL. `null` renders the branded gradient placeholder instead. */
  url: string | null;
  /** Base64 blur-up placeholder from Sanity's LQIP metadata. */
  lqip: string | null;
  alt: string;
  width: number | null;
  height: number | null;
};

/** A purchasable weight/size of a product, e.g. "500g — Rs 340". */
export type Variant = {
  id: string;
  /** Human label shown on the selector, e.g. "500g" or "1kg". */
  label: string;
  /** Normalised weight in grams; used for sorting and delivery estimates. */
  grams: number;
  price: number;
  /** Original price when discounted. Drives the "SALE" badge. */
  compareAtPrice: number | null;
  sku: string | null;
  inStock: boolean;
};

export type CategoryRef = {
  title: string;
  slug: string;
};

export type Product = {
  id: string;
  title: string;
  /** Urdu / Punjabi name, shown alongside the English one. */
  localTitle: string | null;
  slug: string;
  category: CategoryRef;
  shortDescription: string | null;
  description: string | null;
  images: ProductImage[];
  /** Always at least one, sorted lightest first. */
  variants: Variant[];
  origin: string | null;
  rating: number | null;
  reviewCount: number;
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
};

export type Category = {
  id: string;
  title: string;
  localTitle: string | null;
  slug: string;
  description: string | null;
  image: ProductImage | null;
  /** Sort weight; lower shows first. */
  order: number;
  /** Tailwind-safe accent token, see CATEGORY_ACCENTS. */
  accent: CategoryAccent;
};

export type CategoryAccent = "crimson" | "royal" | "saffron" | "emerald";

/** A line in the shopping cart. */
export type CartLine = {
  productId: string;
  productSlug: string;
  productTitle: string;
  variantId: string;
  variantLabel: string;
  grams: number;
  price: number;
  quantity: number;
  image: ProductImage | null;
};

export type OrderCustomer = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes: string;
};

export type OrderPayload = {
  customer: OrderCustomer;
  lines: CartLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
};

/** Price span across a product's variants, for "Rs 54 – Rs 818" labels. */
export type PriceRange = {
  min: number;
  max: number;
};
