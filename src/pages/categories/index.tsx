import type { GetStaticProps } from "next";
import Link from "next/link";

import Seo, { breadcrumbSchema } from "@/components/Seo";
import CategoryCard from "@/components/product/CategoryCard";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import { countByCategory, getAllCategories, getAllProducts } from "@/lib/data";
import { REVALIDATE_SECONDS } from "@/lib/site";
import type { Category } from "@/lib/types";

type Props = {
  categories: Category[];
  counts: Record<string, number>;
};

export default function CategoriesPage({ categories, counts }: Props) {
  return (
    <>
      <Seo
        title="All Categories"
        description="Browse every aisle at Ghizayat Foods — spices, dry fruits, pulses, rice, oil and ghee, murrabajat, and herbs and tea."
        canonicalPath="/categories"
        jsonLd={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Categories", path: "/categories" },
          ]),
        ]}
      />

      <div className="border-b border-cream-200 bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-xs text-ink-400">
            <Link href="/" className="transition hover:text-chilli-600">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink-600">Categories</span>
          </nav>

          <h1 className="mt-3 font-display text-3xl font-bold text-ink-900 sm:text-5xl">
            Shop by category
          </h1>
          <p className="mt-3 max-w-2xl text-ink-500">
            Seven aisles covering everything a Pakistani kitchen goes through in
            a month.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Reveal
          as="ul"
          stagger={0.07}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((category) => (
            <RevealItem as="li" key={category.id}>
              <CategoryCard
                category={category}
                count={counts[category.slug] ?? 0}
                large
              />
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  return {
    props: { categories, counts: countByCategory(products) },
    revalidate: REVALIDATE_SECONDS,
  };
};
