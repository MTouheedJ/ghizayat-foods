import Link from "next/link";
import { useState } from "react";

import ProductMedia from "@/components/ui/ProductMedia";
import { defaultVariant, discountPercent, priceRange } from "@/lib/data";
import { useCart } from "@/lib/cart";
import { cx, formatPrice, formatPriceRange } from "@/lib/format";
import type { CategoryAccent, Product } from "@/lib/types";

type Props = {
  product: Product;
  accent?: CategoryAccent;
  priority?: boolean;
};

export default function ProductCard({
  product,
  accent = "crimson",
  priority = false,
}: Props) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const variant = defaultVariant(product);
  const range = priceRange(product);
  const discount = discountPercent(product);
  const available = product.variants.some((item) => item.inStock);

  function handleAdd() {
    if (!available) return;
    addItem(product, variant, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-chilli-200 hover:shadow-[var(--shadow-lift)]">
      {/* Media */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-cream-100"
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductMedia
          image={product.images[0] ?? null}
          alt={product.title}
          seed={product.slug}
          accent={accent}
          localTitle={product.localTitle}
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {discount > 0 ? (
            <span className="rounded-full bg-chilli-600 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-white shadow-sm">
              −{discount}%
            </span>
          ) : null}
          {product.isNewArrival ? (
            <span className="rounded-full bg-royal-700 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-white shadow-sm">
              New
            </span>
          ) : null}
          {product.isTrending && !discount ? (
            <span className="rounded-full bg-saffron-500 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-white shadow-sm">
              Trending
            </span>
          ) : null}
        </div>

        {!available ? (
          <div className="absolute inset-0 flex items-center justify-center bg-cream-50/75 backdrop-blur-[2px]">
            <span className="rounded-full bg-ink-800 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-cream-50">
              Out of stock
            </span>
          </div>
        ) : null}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-chilli-600">
          {product.category.title}
        </p>

        <h3 className="mt-1.5 font-display text-[1.02rem] font-semibold leading-snug text-ink-800">
          <Link
            href={`/products/${product.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {product.title}
          </Link>
        </h3>

        {product.localTitle ? (
          <p className="font-urdu mt-0.5 text-sm text-ink-400">
            {product.localTitle}
          </p>
        ) : null}

        {product.rating ? (
          <div className="mt-2 flex items-center gap-1.5">
            <div className="flex" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((index) => (
                <svg
                  key={index}
                  viewBox="0 0 20 20"
                  className={cx(
                    "h-3.5 w-3.5",
                    index < Math.round(product.rating!)
                      ? "text-saffron-400"
                      : "text-cream-300",
                  )}
                  fill="currentColor"
                >
                  <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-ink-400">
              {product.rating.toFixed(1)}
              <span className="sr-only"> out of 5</span> ({product.reviewCount})
            </span>
          </div>
        ) : null}

        {/* Price + action */}
        <div className="mt-auto pt-3.5">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-bold text-ink-900">
              {formatPriceRange(range.min, range.max)}
            </span>
            {variant.compareAtPrice ? (
              <span className="text-xs text-ink-400 line-through">
                {formatPrice(variant.compareAtPrice)}
              </span>
            ) : null}
          </div>

          <p className="mt-0.5 text-[0.72rem] text-ink-400">
            {product.variants.length > 1
              ? `${product.variants.length} pack sizes`
              : variant.label}
          </p>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!available}
            className={cx(
              "relative z-10 mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
              !available
                ? "cursor-not-allowed bg-cream-200 text-ink-400"
                : justAdded
                  ? "bg-leaf-600 text-white"
                  : "bg-ink-900 text-cream-50 hover:bg-chilli-600 active:scale-[0.98]",
            )}
          >
            {justAdded ? (
              <>
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m5 13 4 4L19 7" />
                </svg>
                Added
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                {available ? `Add ${variant.label}` : "Unavailable"}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
