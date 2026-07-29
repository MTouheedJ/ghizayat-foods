import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import Seo, { breadcrumbSchema } from "@/components/Seo";
import ProductGrid from "@/components/product/ProductGrid";
import ProductMedia from "@/components/ui/ProductMedia";
import SectionHeading from "@/components/ui/SectionHeading";
import { useCart } from "@/lib/cart";
import {
  defaultVariant,
  getAllCategories,
  getAllProducts,
  getProductBySlug,
  getProductSlugs,
} from "@/lib/data";
import { cx, formatPrice, formatUnitPrice } from "@/lib/format";
import { REVALIDATE_SECONDS, SITE } from "@/lib/site";
import type { Category, Product } from "@/lib/types";

type Props = {
  product: Product;
  related: Product[];
  categories: Category[];
  accent: Category["accent"];
};

export default function ProductPage({
  product,
  related,
  categories,
  accent,
}: Props) {
  const { addItem } = useCart();
  const reduceMotion = useReducedMotion();

  const [variantId, setVariantId] = useState(defaultVariant(product).id);
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [added, setAdded] = useState(false);

  const variant =
    product.variants.find((item) => item.id === variantId) ??
    product.variants[0];

  const saving =
    variant.compareAtPrice && variant.compareAtPrice > variant.price
      ? variant.compareAtPrice - variant.price
      : 0;

  function handleAdd() {
    if (!variant.inStock) return;
    addItem(product, variant, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  const whatsappText = encodeURIComponent(
    `Assalam o Alaikum, I would like to order ${quantity} × ${product.title} (${variant.label}) — ${formatPrice(variant.price * quantity)}.`,
  );

  const productSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description ?? product.shortDescription ?? undefined,
    sku: variant.sku ?? undefined,
    category: product.category.title,
    brand: { "@type": "Brand", name: SITE.name },
    ...(product.images[0]?.url ? { image: [product.images[0].url] } : {}),
    ...(product.rating && product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
    offers: product.variants.map((item) => ({
      "@type": "Offer",
      name: item.label,
      price: item.price,
      priceCurrency: SITE.currency,
      availability: item.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE.url}/products/${product.slug}`,
      ...(item.sku ? { sku: item.sku } : {}),
    })),
  };

  return (
    <>
      <Seo
        title={product.title}
        description={
          product.shortDescription ??
          product.description ??
          `Buy ${product.title} from ${SITE.name}.`
        }
        type="product"
        image={product.images[0]?.url ?? "/og-default.svg"}
        jsonLd={[
          productSchema,
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            {
              name: product.category.title,
              path: `/categories/${product.category.slug}`,
            },
            { name: product.title, path: `/products/${product.slug}` },
          ]),
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-ink-400">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="transition hover:text-chilli-600">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/shop" className="transition hover:text-chilli-600">
                Shop
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/categories/${product.category.slug}`}
                className="transition hover:text-chilli-600"
              >
                {product.category.title}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ink-600">{product.title}</li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* ── Gallery ──────────────────────────────────────────────────── */}
          <div>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative aspect-square overflow-hidden rounded-3xl border border-cream-200 bg-cream-100"
            >
              <ProductMedia
                image={product.images[imageIndex] ?? null}
                alt={product.title}
                seed={`${product.slug}-${imageIndex}`}
                accent={accent}
                localTitle={product.localTitle}
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
              />

              {saving > 0 ? (
                <span className="absolute left-4 top-4 rounded-full bg-chilli-600 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow">
                  Save {formatPrice(saving)}
                </span>
              ) : null}
            </motion.div>

            {product.images.length > 1 ? (
              <ul className="mt-4 grid grid-cols-5 gap-3">
                {product.images.map((image, index) => (
                  <li key={image.url ?? index}>
                    <button
                      type="button"
                      onClick={() => setImageIndex(index)}
                      aria-label={`View image ${index + 1}`}
                      aria-current={index === imageIndex}
                      className={cx(
                        "relative block aspect-square w-full overflow-hidden rounded-xl border-2 transition",
                        index === imageIndex
                          ? "border-chilli-500"
                          : "border-cream-200 hover:border-cream-300",
                      )}
                    >
                      <ProductMedia
                        image={image}
                        alt=""
                        seed={`${product.slug}-thumb-${index}`}
                        accent={accent}
                        sizes="12vw"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* ── Buy box ──────────────────────────────────────────────────── */}
          <div>
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-xs font-bold uppercase tracking-[0.18em] text-chilli-600 transition hover:text-chilli-700"
            >
              {product.category.title}
            </Link>

            <h1 className="mt-2.5 font-display text-3xl font-bold leading-tight text-ink-900 sm:text-[2.6rem]">
              {product.title}
            </h1>

            {product.localTitle ? (
              <p className="font-urdu mt-1 text-2xl text-ink-500">
                {product.localTitle}
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              {product.rating ? (
                <span className="flex items-center gap-1.5">
                  <span className="flex" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <svg
                        key={index}
                        viewBox="0 0 20 20"
                        className={cx(
                          "h-4 w-4",
                          index < Math.round(product.rating!)
                            ? "text-saffron-400"
                            : "text-cream-300",
                        )}
                        fill="currentColor"
                      >
                        <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                      </svg>
                    ))}
                  </span>
                  <span className="text-ink-500">
                    {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </span>
              ) : null}

              {product.origin ? (
                <span className="inline-flex items-center gap-1.5 text-ink-500">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 text-royal-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  {product.origin}
                </span>
              ) : null}
            </div>

            {product.shortDescription ? (
              <p className="mt-6 text-base leading-relaxed text-ink-600">
                {product.shortDescription}
              </p>
            ) : null}

            {/* Price */}
            <div className="mt-7 flex flex-wrap items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-ink-900">
                {formatPrice(variant.price)}
              </span>
              {variant.compareAtPrice &&
              variant.compareAtPrice > variant.price ? (
                <span className="text-lg text-ink-400 line-through">
                  {formatPrice(variant.compareAtPrice)}
                </span>
              ) : null}
              <span className="text-sm text-ink-400">
                {formatUnitPrice(variant.price, variant.grams)}
              </span>
            </div>

            {/* Variants */}
            <fieldset className="mt-7">
              <legend className="text-xs font-bold uppercase tracking-[0.16em] text-ink-400">
                Choose pack size
              </legend>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {product.variants.map((item) => {
                  const isActive = item.id === variant.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setVariantId(item.id)}
                      disabled={!item.inStock}
                      aria-pressed={isActive}
                      className={cx(
                        "relative rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition",
                        !item.inStock
                          ? "cursor-not-allowed border-cream-200 text-ink-400 line-through opacity-60"
                          : isActive
                            ? "border-chilli-600 bg-chilli-50 text-chilli-700"
                            : "border-cream-300 text-ink-700 hover:border-chilli-300",
                      )}
                    >
                      {item.label}
                      <span className="mt-0.5 block text-[0.7rem] font-medium text-ink-400">
                        {formatPrice(item.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Quantity + add */}
            <div className="mt-7 flex flex-wrap items-stretch gap-3">
              <div className="flex items-center rounded-xl border border-cream-300 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="px-4 py-3.5 text-lg text-ink-600 transition hover:text-chilli-600"
                >
                  −
                </button>
                <span
                  aria-live="polite"
                  className="w-10 text-center font-semibold text-ink-900"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  aria-label="Increase quantity"
                  className="px-4 py-3.5 text-lg text-ink-600 transition hover:text-chilli-600"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={!variant.inStock}
                className={cx(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-all",
                  !variant.inStock
                    ? "cursor-not-allowed bg-cream-200 text-ink-400"
                    : added
                      ? "bg-leaf-600 text-white"
                      : "bg-chilli-600 text-white hover:bg-chilli-700 active:scale-[0.98]",
                )}
              >
                {!variant.inStock
                  ? "Out of stock"
                  : added
                    ? "Added to cart ✓"
                    : `Add to cart · ${formatPrice(variant.price * quantity)}`}
              </button>
            </div>

            <a
              href={`https://wa.me/${SITE.whatsapp}?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-leaf-600/30 bg-leaf-100/50 px-6 py-3 text-sm font-semibold text-leaf-700 transition hover:bg-leaf-100"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4.5 w-4.5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.5-.6a11 11 0 0 1-4.3-4.4c-.3-.6-.5-1.1-.5-1.6 0-.5.2-1 .5-1.3.2-.2.4-.3.6-.3h.5c.2 0 .4 0 .5.4l.7 1.7c0 .2 0 .3-.1.4l-.3.4-.2.2c-.1.1-.2.3 0 .5a8 8 0 0 0 3.5 3c.3.1.4.1.6-.1l.7-.8c.2-.2.3-.2.5-.1l1.7.8c.2.1.3.2.4.3v.7Z" />
              </svg>
              Order this on WhatsApp
            </a>

            {/* Assurances */}
            <ul className="mt-8 grid gap-3 border-t border-cream-200 pt-7 sm:grid-cols-2">
              {[
                ["Cash on delivery", "Pay the rider when it arrives"],
                ["Sealed & weighed", "Printed weight on every pack"],
                ["Ground fresh", "Milled in small weekly batches"],
                ["Easy returns", "Wrong or damaged? We replace it"],
              ].map(([title, body]) => (
                <li key={title} className="flex items-start gap-2.5">
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-0.5 h-4.5 w-4.5 shrink-0 text-leaf-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                  <span>
                    <span className="block text-sm font-semibold text-ink-800">
                      {title}
                    </span>
                    <span className="block text-xs text-ink-500">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Description ────────────────────────────────────────────────── */}
        {product.description ? (
          <section className="mt-16 grid gap-10 border-t border-cream-200 pt-12 lg:grid-cols-3">
            <h2 className="font-display text-2xl font-bold text-ink-900">
              About this product
            </h2>
            <div className="lg:col-span-2">
              <p className="text-base leading-[1.85] text-ink-600">
                {product.description}
              </p>

              <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {[
                  ["Category", product.category.title],
                  ["Origin", product.origin ?? "—"],
                  [
                    "Available sizes",
                    product.variants.map((item) => item.label).join(", "),
                  ],
                  ["SKU", variant.sku ?? "—"],
                ].map(([term, value]) => (
                  <div
                    key={term}
                    className="border-b border-cream-200 pb-3 last:border-0"
                  >
                    <dt className="text-xs font-bold uppercase tracking-[0.14em] text-ink-400">
                      {term}
                    </dt>
                    <dd className="mt-1 text-sm text-ink-700">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        ) : null}

        {/* ── Related ────────────────────────────────────────────────────── */}
        {related.length > 0 ? (
          <section className="mt-20 border-t border-cream-200 pt-14">
            <SectionHeading
              eyebrow="You might also need"
              title={`More from ${product.category.title}`}
              href={`/categories/${product.category.slug}`}
              linkLabel="View category"
            />
            <div className="mt-10">
              <ProductGrid products={related} categories={categories} />
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getProductSlugs();

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    // New products added in the CMS render on first request rather than
    // requiring a rebuild.
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const product = await getProductBySlug(slug);

  if (!product) return { notFound: true, revalidate: REVALIDATE_SECONDS };

  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  const related = products
    .filter(
      (item) =>
        item.category.slug === product.category.slug && item.id !== product.id,
    )
    .slice(0, 4);

  const accent =
    categories.find((item) => item.slug === product.category.slug)?.accent ??
    "crimson";

  return {
    props: { product, related, categories, accent },
    revalidate: REVALIDATE_SECONDS,
  };
};
