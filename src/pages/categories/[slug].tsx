import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useMemo, useState } from "react";

import Seo, { breadcrumbSchema } from "@/components/Seo";
import ProductGrid from "@/components/product/ProductGrid";
import { cx } from "@/lib/format";
import {
  getAllCategories,
  getAllProducts,
  getCategorySlugs,
  priceRange,
  productsInCategory,
} from "@/lib/data";
import { REVALIDATE_SECONDS, SITE } from "@/lib/site";
import type { Category, Product } from "@/lib/types";

type Props = {
  category: Category;
  products: Product[];
  categories: Category[];
};

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const SORTS: Array<{ key: SortKey; label: string }> = [
  { key: "featured", label: "Popularity" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "name", label: "Name A–Z" },
];

const HEADER_TONE: Record<Category["accent"], string> = {
  crimson: "from-chilli-700 via-chilli-800 to-royal-900",
  royal: "from-royal-700 via-royal-800 to-ink-900",
  saffron: "from-saffron-600 via-chilli-700 to-royal-800",
  emerald: "from-leaf-700 via-royal-800 to-ink-900",
};

export default function CategoryPage({
  category,
  products,
  categories,
}: Props) {
  const [sort, setSort] = useState<SortKey>("featured");

  const sorted = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => priceRange(a).min - priceRange(b).min);
      case "price-desc":
        return list.sort((a, b) => priceRange(b).max - priceRange(a).max);
      case "name":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return list.sort(
          (a, b) =>
            Number(b.isTrending) - Number(a.isTrending) ||
            (b.rating ?? 0) - (a.rating ?? 0),
        );
    }
  }, [products, sort]);

  return (
    <>
      <Seo
        title={category.title}
        description={
          category.description ??
          `Shop ${category.title} at ${SITE.name}. Cash on delivery across Pakistan.`
        }
        canonicalPath={`/categories/${category.slug}`}
        jsonLd={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Categories", path: "/categories" },
            { name: category.title, path: `/categories/${category.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: category.title,
            description: category.description ?? undefined,
            url: `${SITE.url}/categories/${category.slug}`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: products.length,
              itemListElement: products.slice(0, 20).map((product, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: product.title,
                url: `${SITE.url}/products/${product.slug}`,
              })),
            },
          },
        ]}
      />

      {/* Header band */}
      <div
        className={cx(
          "relative overflow-hidden bg-gradient-to-br text-cream-50",
          HEADER_TONE[category.accent],
        )}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="bg-grain absolute inset-0 opacity-30 mix-blend-overlay" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-xs text-cream-200/70">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="transition hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/categories" className="transition hover:text-white">
                  Categories
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-cream-100">{category.title}</li>
            </ol>
          </nav>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl font-bold leading-tight sm:text-6xl">
                {category.title}
              </h1>
              {category.localTitle ? (
                <p className="font-urdu mt-2 text-2xl text-cream-200/70">
                  {category.localTitle}
                </p>
              ) : null}
              {category.description ? (
                <p className="mt-4 text-base leading-relaxed text-cream-100/80">
                  {category.description}
                </p>
              ) : null}
            </div>

            <p className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {products.length > 0 ? (
          <>
            <div className="mb-8 flex items-center justify-between gap-4">
              <p className="text-sm text-ink-500">
                Showing all {products.length} items
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="cat-sort" className="sr-only">
                  Sort by
                </label>
                <select
                  id="cat-sort"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortKey)}
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

            <ProductGrid
              products={sorted}
              categories={categories}
              priorityCount={4}
              animate={false}
            />
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-cream-300 bg-white/50 px-6 py-20 text-center">
            <p className="font-display text-xl font-semibold text-ink-800">
              Nothing here yet
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ink-500">
              We are restocking this aisle. Browse the rest of the shop in the
              meantime.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-block rounded-full bg-chilli-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-chilli-700"
            >
              Go to shop
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getCategorySlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const [allProducts, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  const category = categories.find((item) => item.slug === slug);
  if (!category) return { notFound: true, revalidate: REVALIDATE_SECONDS };

  return {
    props: {
      category,
      products: productsInCategory(allProducts, slug),
      categories,
    },
    revalidate: REVALIDATE_SECONDS,
  };
};
