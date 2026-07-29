import type { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import Seo, { breadcrumbSchema } from "@/components/Seo";
import ProductGrid from "@/components/product/ProductGrid";
import { getAllCategories, getAllProducts, priceRange } from "@/lib/data";
import { cx, formatPrice } from "@/lib/format";
import { REVALIDATE_SECONDS } from "@/lib/site";
import type { Category, Product } from "@/lib/types";

type Props = {
  products: Product[];
  categories: Category[];
  maxPrice: number;
};

type SortKey = "featured" | "price-asc" | "price-desc" | "name" | "trending" | "newest";

const SORTS: Array<{ key: SortKey; label: string }> = [
  { key: "featured", label: "Popularity" },
  { key: "newest", label: "Latest" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "name", label: "Name A–Z" },
];

const PER_PAGE = 12;

function readParam(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

/**
 * Page shell.
 *
 * On a statically-generated page `router.query` is empty during the first
 * render and populated a tick later. Rather than syncing that into state from
 * an effect (which causes a cascading re-render), we feed the params in as
 * props and let a `key` change remount the browser with fresh initial state.
 */
export default function ShopPage({ products, categories, maxPrice }: Props) {
  const router = useRouter();

  const initialQuery = readParam(router.query.q);
  const initialCategory = readParam(router.query.category);
  const sortParam = readParam(router.query.sort);
  const initialSort: SortKey = SORTS.some((option) => option.key === sortParam)
    ? (sortParam as SortKey)
    : "featured";

  return (
    <ShopBrowser
      key={`${initialQuery}|${initialCategory}|${sortParam}`}
      products={products}
      categories={categories}
      maxPrice={maxPrice}
      initialQuery={initialQuery}
      initialCategory={initialCategory}
      initialSort={initialSort}
    />
  );
}

function ShopBrowser({
  products,
  categories,
  maxPrice,
  initialQuery,
  initialCategory,
  initialSort,
}: Props & {
  initialQuery: string;
  initialCategory: string;
  initialSort: SortKey;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [activeCategories, setActiveCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : [],
  );
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [budget, setBudget] = useState(maxPrice);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    const result = products.filter((product) => {
      if (
        activeCategories.length > 0 &&
        !activeCategories.includes(product.category.slug)
      ) {
        return false;
      }

      if (inStockOnly && !product.variants.some((v) => v.inStock)) return false;

      if (priceRange(product).min > budget) return false;

      if (term) {
        const haystack = [
          product.title,
          product.localTitle ?? "",
          product.category.title,
          product.origin ?? "",
          product.shortDescription ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }

      return true;
    });

    const sorted = [...result];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => priceRange(a).min - priceRange(b).min);
        break;
      case "price-desc":
        sorted.sort((a, b) => priceRange(b).max - priceRange(a).max);
        break;
      case "name":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
        sorted.sort(
          (a, b) => Number(b.isNewArrival) - Number(a.isNewArrival),
        );
        break;
      default:
        sorted.sort(
          (a, b) =>
            Number(b.isTrending) - Number(a.isTrending) ||
            (b.rating ?? 0) - (a.rating ?? 0),
        );
    }

    return sorted;
  }, [products, activeCategories, inStockOnly, budget, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  // Clamp rather than reset-by-effect: if a filter shrinks the result set
  // below the current page, fall back to the last valid page during render.
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  /* Every filter change also returns to page 1. Doing this in the event
     handlers — not an effect — avoids a second render pass per keystroke. */

  function changeQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function toggleCategory(slug: string) {
    setActiveCategories((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug],
    );
    setPage(1);
  }

  function changeStock(value: boolean) {
    setInStockOnly(value);
    setPage(1);
  }

  function changeBudget(value: number) {
    setBudget(value);
    setPage(1);
  }

  function changeSort(value: SortKey) {
    setSort(value);
    setPage(1);
  }

  function reset() {
    setQuery("");
    setActiveCategories([]);
    setInStockOnly(false);
    setBudget(maxPrice);
    setSort("featured");
    setPage(1);
  }

  const hasFilters =
    query.trim() !== "" ||
    activeCategories.length > 0 ||
    inStockOnly ||
    budget < maxPrice;

  return (
    <>
      <Seo
        title="Shop All Products"
        description="Browse every spice, dry fruit, pulse, rice and ghee we stock. Filter by category and price, then order with cash on delivery anywhere in Pakistan."
        canonicalPath="/shop"
        jsonLd={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
          ]),
        ]}
      />

      {/* Page header */}
      <div className="border-b border-cream-200 bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-xs text-ink-400">
            <Link href="/" className="transition hover:text-chilli-600">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink-600">Shop</span>
          </nav>

          <h1 className="mt-3 font-display text-3xl font-bold text-ink-900 sm:text-5xl">
            All products
          </h1>
          <p className="mt-3 max-w-2xl text-ink-500">
            {products.length} items across {categories.length} categories —
            weighed, sealed and shipped from Lahore.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-10">
          {/* ── Filters ──────────────────────────────────────────────────── */}
          <aside
            className={cx(
              "lg:block",
              filtersOpen
                ? "fixed inset-0 z-[70] overflow-y-auto bg-cream-50 p-5 lg:static lg:z-auto lg:overflow-visible lg:bg-transparent lg:p-0"
                : "hidden",
            )}
          >
            <div className="mb-5 flex items-center justify-between lg:hidden">
              <h2 className="font-display text-xl font-bold">Filters</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="rounded-lg p-2 hover:bg-cream-200"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div className="space-y-7 lg:sticky lg:top-40">
              {/* Search */}
              <div>
                <label
                  htmlFor="shop-search"
                  className="text-xs font-bold uppercase tracking-[0.16em] text-ink-400"
                >
                  Search
                </label>
                <input
                  id="shop-search"
                  type="search"
                  value={query}
                  onChange={(event) => changeQuery(event.target.value)}
                  placeholder="haldi, badam…"
                  className="mt-2.5 w-full rounded-xl border border-cream-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-ink-400 focus:border-chilli-400 focus:outline-none focus:ring-4 focus:ring-chilli-500/10"
                />
              </div>

              {/* Categories */}
              <fieldset>
                <legend className="text-xs font-bold uppercase tracking-[0.16em] text-ink-400">
                  Category
                </legend>
                <ul className="mt-3 space-y-1.5">
                  {categories.map((category) => (
                    <li key={category.slug}>
                      <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-ink-600 transition hover:bg-cream-100">
                        <input
                          type="checkbox"
                          checked={activeCategories.includes(category.slug)}
                          onChange={() => toggleCategory(category.slug)}
                          className="h-4 w-4 rounded border-cream-300 text-chilli-600 focus:ring-chilli-500"
                        />
                        {category.title}
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>

              {/* Price */}
              <div>
                <label
                  htmlFor="shop-budget"
                  className="text-xs font-bold uppercase tracking-[0.16em] text-ink-400"
                >
                  Max starting price
                </label>
                <input
                  id="shop-budget"
                  type="range"
                  min={50}
                  max={maxPrice}
                  step={50}
                  value={budget}
                  onChange={(event) => changeBudget(Number(event.target.value))}
                  className="mt-3 w-full accent-chilli-600"
                />
                <p className="mt-1.5 text-sm font-medium text-ink-700">
                  Up to {formatPrice(budget)}
                </p>
              </div>

              {/* Availability */}
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-600">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(event) => changeStock(event.target.checked)}
                  className="h-4 w-4 rounded border-cream-300 text-chilli-600 focus:ring-chilli-500"
                />
                In stock only
              </label>

              {hasFilters ? (
                <button
                  type="button"
                  onClick={reset}
                  className="w-full rounded-xl border border-cream-300 px-4 py-2.5 text-sm font-semibold text-ink-600 transition hover:border-chilli-400 hover:text-chilli-700"
                >
                  Clear all filters
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="w-full rounded-xl bg-ink-900 px-4 py-3 text-sm font-semibold text-cream-50 lg:hidden"
              >
                Show {filtered.length} results
              </button>
            </div>
          </aside>

          {/* ── Results ──────────────────────────────────────────────────── */}
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-500">
                <span className="font-semibold text-ink-800">
                  {filtered.length}
                </span>{" "}
                {filtered.length === 1 ? "product" : "products"}
                {query.trim() ? (
                  <>
                    {" "}
                    for <span className="font-medium">“{query.trim()}”</span>
                  </>
                ) : null}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-cream-300 bg-white px-3.5 py-2 text-sm font-medium lg:hidden"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M4 6h16M7 12h10M10 18h4" />
                  </svg>
                  Filters
                  {hasFilters ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-chilli-600" />
                  ) : null}
                </button>

                <label className="sr-only" htmlFor="shop-sort">
                  Sort by
                </label>
                <select
                  id="shop-sort"
                  value={sort}
                  onChange={(event) => changeSort(event.target.value as SortKey)}
                  className="rounded-xl border border-cream-300 bg-white px-3.5 py-2 text-sm font-medium text-ink-700 focus:border-chilli-400 focus:outline-none"
                >
                  {SORTS.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {visible.length > 0 ? (
              <>
                <ProductGrid
                  products={visible}
                  categories={categories}
                  className="lg:grid-cols-3 xl:grid-cols-4"
                  priorityCount={4}
                  animate={false}
                />

                {totalPages > 1 ? (
                  <nav
                    aria-label="Pagination"
                    className="mt-12 flex items-center justify-center gap-1.5"
                  >
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={safePage === 1}
                      className="rounded-lg border border-cream-300 px-3 py-2 text-sm font-medium text-ink-600 transition enabled:hover:border-chilli-400 disabled:opacity-40"
                    >
                      Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                      .filter(
                        (number) =>
                          number === 1 ||
                          number === totalPages ||
                          Math.abs(number - safePage) <= 1,
                      )
                      .map((number, index, list) => (
                        <span key={number} className="flex items-center gap-1.5">
                          {index > 0 && number - list[index - 1] > 1 ? (
                            <span className="px-1 text-ink-400">…</span>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => setPage(number)}
                            aria-current={number === safePage ? "page" : undefined}
                            className={cx(
                              "min-w-9 rounded-lg px-3 py-2 text-sm font-medium transition",
                              number === safePage
                                ? "bg-chilli-600 text-white"
                                : "border border-cream-300 text-ink-600 hover:border-chilli-400",
                            )}
                          >
                            {number}
                          </button>
                        </span>
                      ))}

                    <button
                      type="button"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={safePage === totalPages}
                      className="rounded-lg border border-cream-300 px-3 py-2 text-sm font-medium text-ink-600 transition enabled:hover:border-chilli-400 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </nav>
                ) : null}
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-cream-300 bg-white/50 px-6 py-20 text-center">
                <p className="font-display text-xl font-semibold text-ink-800">
                  Nothing matched that
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-ink-500">
                  Try a different spelling, or clear the filters and browse the
                  full shelf.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-6 rounded-full bg-chilli-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-chilli-700"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  const highest = products.reduce(
    (max, product) => Math.max(max, priceRange(product).min),
    0,
  );

  return {
    props: {
      products,
      categories,
      maxPrice: Math.ceil(highest / 100) * 100 || 5000,
    },
    revalidate: REVALIDATE_SECONDS,
  };
};
