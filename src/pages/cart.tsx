import type { GetStaticProps } from "next";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import Seo from "@/components/Seo";
import ProductMedia from "@/components/ui/ProductMedia";
import { useCart } from "@/lib/cart";
import { getAllCategories } from "@/lib/data";
import { formatPrice, formatWeight } from "@/lib/format";
import { FREE_DELIVERY_THRESHOLD, REVALIDATE_SECONDS } from "@/lib/site";
import type { Category } from "@/lib/types";

export default function CartPage() {
  const reduceMotion = useReducedMotion();
  const {
    lines,
    isReady,
    subtotal,
    deliveryFee,
    total,
    freeDeliveryRemaining,
    setQuantity,
    removeItem,
    clear,
  } = useCart();

  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <>
      <Seo
        title="Your Cart"
        description="Review your Ghizayat Foods order before checking out with cash on delivery."
        noIndex
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-ink-900 sm:text-5xl">
          Your cart
        </h1>

        {/* Render nothing decisive until localStorage is read, so the server
            and client markup agree and there's no flash of "empty cart". */}
        {!isReady ? (
          <div className="mt-10 space-y-3" aria-busy="true">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl bg-cream-200/70"
              />
            ))}
          </div>
        ) : lines.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-cream-300 bg-white/60 px-6 py-20 text-center">
            <span
              aria-hidden="true"
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cream-100 text-chilli-500"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 4h2.2l2 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.55L20.5 8H6.2" />
                <circle cx="10" cy="20" r="1.4" />
                <circle cx="17.5" cy="20" r="1.4" />
              </svg>
            </span>
            <p className="mt-5 font-display text-2xl font-bold text-ink-900">
              Your cart is empty
            </p>
            <p className="mx-auto mt-2 max-w-sm text-ink-500">
              Add a few masalas and dry fruits, and we will get them to your
              door.
            </p>
            <Link
              href="/shop"
              className="mt-7 inline-block rounded-full bg-chilli-600 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-chilli-700"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="mt-10 lg:grid lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-10">
            {/* Lines */}
            <div>
              {freeDeliveryRemaining > 0 ? (
                <div className="mb-6 rounded-2xl border border-saffron-300/60 bg-saffron-50 p-4">
                  <p className="text-sm font-medium text-ink-700">
                    Add {formatPrice(freeDeliveryRemaining)} more for{" "}
                    <span className="font-bold text-chilli-700">
                      free delivery
                    </span>
                  </p>
                  <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-chilli-500 to-saffron-500"
                      initial={false}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: reduceMotion ? 0 : 0.5 }}
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-leaf-500/30 bg-leaf-100/60 p-4 text-sm font-semibold text-leaf-700">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                  You have unlocked free delivery
                </div>
              )}

              <ul className="space-y-3">
                <AnimatePresence initial={false}>
                  {lines.map((line) => (
                    <motion.li
                      key={line.variantId}
                      layout={!reduceMotion}
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={
                        reduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, x: -24, height: 0, marginBottom: 0 }
                      }
                      transition={{ duration: 0.28 }}
                      className="flex gap-4 overflow-hidden rounded-2xl border border-cream-200 bg-white p-3.5 sm:p-4"
                    >
                      <Link
                        href={`/products/${line.productSlug}`}
                        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream-100"
                      >
                        <ProductMedia
                          image={line.image}
                          alt={line.productTitle}
                          seed={line.productSlug}
                          sizes="96px"
                        />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h2 className="truncate font-display text-base font-semibold text-ink-900">
                              <Link
                                href={`/products/${line.productSlug}`}
                                className="transition hover:text-chilli-600"
                              >
                                {line.productTitle}
                              </Link>
                            </h2>
                            <p className="mt-0.5 text-xs text-ink-400">
                              {line.variantLabel}
                              {line.grams
                                ? ` · ${formatWeight(line.grams)}`
                                : ""}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(line.variantId)}
                            aria-label={`Remove ${line.productTitle}`}
                            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-chilli-50 hover:text-chilli-600"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="h-4.5 w-4.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.9}
                              strokeLinecap="round"
                              aria-hidden="true"
                            >
                              <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v5M14 11v5" />
                            </svg>
                          </button>
                        </div>

                        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                          <div className="flex items-center rounded-lg border border-cream-300">
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(line.variantId, line.quantity - 1)
                              }
                              aria-label="Decrease quantity"
                              className="px-3 py-1.5 text-ink-600 transition hover:text-chilli-600"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(line.variantId, line.quantity + 1)
                              }
                              aria-label="Increase quantity"
                              className="px-3 py-1.5 text-ink-600 transition hover:text-chilli-600"
                            >
                              +
                            </button>
                          </div>

                          <p className="font-display text-lg font-bold text-ink-900">
                            {formatPrice(line.price * line.quantity)}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <Link
                  href="/shop"
                  className="text-sm font-semibold text-chilli-600 transition hover:text-chilli-700"
                >
                  ← Continue shopping
                </Link>
                <button
                  type="button"
                  onClick={clear}
                  className="text-sm text-ink-400 transition hover:text-chilli-600"
                >
                  Empty cart
                </button>
              </div>
            </div>

            {/* Summary */}
            <aside className="mt-10 lg:sticky lg:top-40 lg:mt-0">
              <div className="rounded-2xl border border-cream-200 bg-white p-6">
                <h2 className="font-display text-xl font-bold text-ink-900">
                  Order summary
                </h2>

                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-500">Subtotal</dt>
                    <dd className="font-semibold text-ink-800">
                      {formatPrice(subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-500">Delivery</dt>
                    <dd className="font-semibold text-ink-800">
                      {deliveryFee === 0 ? (
                        <span className="text-leaf-600">Free</span>
                      ) : (
                        formatPrice(deliveryFee)
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-cream-200 pt-3">
                    <dt className="font-display text-base font-bold text-ink-900">
                      Total
                    </dt>
                    <dd className="font-display text-xl font-bold text-chilli-700">
                      {formatPrice(total)}
                    </dd>
                  </div>
                </dl>

                <Link
                  href="/checkout"
                  className="mt-6 block rounded-xl bg-chilli-600 px-6 py-3.5 text-center text-sm font-bold text-white transition hover:bg-chilli-700 active:scale-[0.98]"
                >
                  Checkout · Cash on Delivery
                </Link>

                <p className="mt-3.5 flex items-start gap-2 text-xs leading-relaxed text-ink-400">
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 3l7 3v6c0 4.4-3 8.2-7 9-4-.8-7-4.6-7-9V6l7-3Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  No card needed. Pay the rider in cash when your order arrives.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<{
  categories: Category[];
}> = async () => ({
  props: { categories: await getAllCategories() },
  revalidate: REVALIDATE_SECONDS,
});
