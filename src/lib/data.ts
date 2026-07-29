/**
 * The data layer — the only module that knows where products come from.
 *
 * Every page calls these functions and receives plain domain objects. Today
 * they resolve from Sanity (when configured) or the demo catalogue. Swapping
 * to any other source later means editing this file and nothing else.
 */

import { DEMO_CATEGORIES, DEMO_PRODUCTS } from "./demo-data";
import {
  ALL_CATEGORIES_QUERY,
  ALL_PRODUCTS_QUERY,
  CATEGORY_SLUGS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  PRODUCT_SLUGS_QUERY,
} from "./queries";
import { getSanityClient, isSanityConfigured } from "./sanity.client";
import { toProductImage, toProductImages } from "./sanity-image";
import type {
  Category,
  CategoryAccent,
  PriceRange,
  Product,
  Variant,
} from "./types";

const ACCENTS: CategoryAccent[] = ["crimson", "royal", "saffron", "emerald"];

/* ── Normalisers ───────────────────────────────────────────────────────────*/

type RawProduct = Record<string, unknown>;

function num(value: unknown, fallback: number | null = null): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normaliseVariants(raw: unknown, productTitle: string): Variant[] {
  if (!Array.isArray(raw)) return [];

  const variants = raw
    .map((entry, index): Variant | null => {
      const item = entry as Record<string, unknown>;
      const price = num(item.price);
      if (price === null) return null;

      const grams = num(item.grams, 0)!;
      return {
        id: str(item.id) ?? `${productTitle}-${index}`,
        label: str(item.label) ?? `${grams} g`,
        grams,
        price,
        compareAtPrice: num(item.compareAtPrice),
        sku: str(item.sku),
        inStock: item.inStock !== false,
      };
    })
    .filter((variant): variant is Variant => variant !== null);

  return variants.sort((a, b) => a.grams - b.grams);
}

function normaliseProduct(raw: RawProduct): Product | null {
  const title = str(raw.title);
  const slug = str(raw.slug);
  if (!title || !slug) return null;

  const variants = normaliseVariants(raw.variants, slug);
  // A product with no priced variant cannot be sold or displayed sensibly.
  if (variants.length === 0) return null;

  const categoryRaw = (raw.category ?? {}) as Record<string, unknown>;

  return {
    id: str(raw.id) ?? slug,
    title,
    localTitle: str(raw.localTitle),
    slug,
    category: {
      title: str(categoryRaw.title) ?? "Uncategorised",
      slug: str(categoryRaw.slug) ?? "uncategorised",
    },
    shortDescription: str(raw.shortDescription),
    description: str(raw.description),
    images: toProductImages(
      raw.images as Parameters<typeof toProductImages>[0],
      title,
    ),
    variants,
    origin: str(raw.origin),
    rating: num(raw.rating),
    reviewCount: num(raw.reviewCount, 0)!,
    isFeatured: raw.isFeatured === true,
    isTrending: raw.isTrending === true,
    isNewArrival: raw.isNewArrival === true,
  };
}

function normaliseCategory(raw: RawProduct, index: number): Category | null {
  const title = str(raw.title);
  const slug = str(raw.slug);
  if (!title || !slug) return null;

  const accent = str(raw.accent) as CategoryAccent | null;

  return {
    id: str(raw.id) ?? slug,
    title,
    localTitle: str(raw.localTitle),
    slug,
    description: str(raw.description),
    image: toProductImage(
      raw.image as Parameters<typeof toProductImage>[0],
      title,
    ),
    order: num(raw.order, index)!,
    accent:
      accent && ACCENTS.includes(accent)
        ? accent
        : ACCENTS[index % ACCENTS.length],
  };
}

/* ── Fetch helpers ─────────────────────────────────────────────────────────*/

/**
 * Runs a GROQ query, falling back to demo data on any failure.
 *
 * A CMS outage at build time should degrade to a browsable catalogue, never a
 * failed deploy.
 */
async function query<T>(groq: string, fallback: T, params = {}): Promise<T> {
  const client = getSanityClient();
  if (!client) return fallback;

  try {
    const result = await client.fetch<T>(groq, params);
    if (result === null || result === undefined) return fallback;
    if (Array.isArray(result) && result.length === 0) return fallback;
    return result;
  } catch (error) {
    console.error("[sanity] query failed, serving demo data:", error);
    return fallback;
  }
}

/* ── Public API ────────────────────────────────────────────────────────────*/

export async function getAllProducts(): Promise<Product[]> {
  if (!isSanityConfigured) return DEMO_PRODUCTS;

  const raw = await query<RawProduct[]>(ALL_PRODUCTS_QUERY, []);
  if (raw.length === 0) return DEMO_PRODUCTS;

  const products = raw
    .map(normaliseProduct)
    .filter((p): p is Product => p !== null);

  return products.length > 0 ? products : DEMO_PRODUCTS;
}

export async function getAllCategories(): Promise<Category[]> {
  if (!isSanityConfigured) return DEMO_CATEGORIES;

  const raw = await query<RawProduct[]>(ALL_CATEGORIES_QUERY, []);
  if (raw.length === 0) return DEMO_CATEGORIES;

  const categories = raw
    .map(normaliseCategory)
    .filter((c): c is Category => c !== null);

  return categories.length > 0 ? categories : DEMO_CATEGORIES;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSanityConfigured) {
    return DEMO_PRODUCTS.find((product) => product.slug === slug) ?? null;
  }

  const raw = await query<RawProduct | null>(PRODUCT_BY_SLUG_QUERY, null, {
    slug,
  });
  if (!raw) {
    return DEMO_PRODUCTS.find((product) => product.slug === slug) ?? null;
  }
  return normaliseProduct(raw);
}

export async function getProductSlugs(): Promise<string[]> {
  if (!isSanityConfigured) return DEMO_PRODUCTS.map((p) => p.slug);

  const slugs = await query<string[]>(
    PRODUCT_SLUGS_QUERY,
    DEMO_PRODUCTS.map((p) => p.slug),
  );
  return slugs.filter(Boolean);
}

export async function getCategorySlugs(): Promise<string[]> {
  if (!isSanityConfigured) return DEMO_CATEGORIES.map((c) => c.slug);

  const slugs = await query<string[]>(
    CATEGORY_SLUGS_QUERY,
    DEMO_CATEGORIES.map((c) => c.slug),
  );
  return slugs.filter(Boolean);
}

/* ── Derived selectors (pure — safe to call in getStaticProps) ─────────────*/

export function priceRange(product: Product): PriceRange {
  const prices = product.variants.map((v) => v.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function defaultVariant(product: Product): Variant {
  return product.variants.find((v) => v.inStock) ?? product.variants[0];
}

export function isInStock(product: Product): boolean {
  return product.variants.some((v) => v.inStock);
}

export function discountPercent(product: Product): number {
  const variant = defaultVariant(product);
  if (!variant.compareAtPrice || variant.compareAtPrice <= variant.price) {
    return 0;
  }
  return Math.round(
    ((variant.compareAtPrice - variant.price) / variant.compareAtPrice) * 100,
  );
}

export function productsInCategory(
  products: Product[],
  categorySlug: string,
): Product[] {
  return products.filter((p) => p.category.slug === categorySlug);
}

/** Counts per category slug, for the nav and category cards. */
export function countByCategory(products: Product[]): Record<string, number> {
  return products.reduce<Record<string, number>>((acc, product) => {
    acc[product.category.slug] = (acc[product.category.slug] ?? 0) + 1;
    return acc;
  }, {});
}
