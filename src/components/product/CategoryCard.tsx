import Link from "next/link";

import ProductMedia from "@/components/ui/ProductMedia";
import { cx } from "@/lib/format";
import type { Category } from "@/lib/types";

const ACCENT_RING: Record<Category["accent"], string> = {
  crimson: "group-hover:border-chilli-300 group-hover:shadow-chilli-500/15",
  royal: "group-hover:border-royal-300 group-hover:shadow-royal-500/15",
  saffron: "group-hover:border-saffron-300 group-hover:shadow-saffron-500/15",
  emerald: "group-hover:border-leaf-500/40 group-hover:shadow-leaf-500/15",
};

export default function CategoryCard({
  category,
  count,
  large = false,
}: {
  category: Category;
  count?: number;
  large?: boolean;
}) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cx(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        ACCENT_RING[category.accent],
      )}
    >
      <div
        className={cx(
          "relative overflow-hidden bg-cream-100",
          large ? "aspect-[4/3]" : "aspect-[5/4]",
        )}
      >
        <ProductMedia
          image={category.image}
          alt={category.title}
          seed={category.slug}
          accent={category.accent}
          localTitle={category.localTitle}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3
          className={cx(
            "font-display font-semibold text-ink-800 transition-colors group-hover:text-chilli-700",
            large ? "text-xl" : "text-base",
          )}
        >
          {category.title}
        </h3>

        {typeof count === "number" ? (
          <p className="mt-1 text-xs text-ink-400">
            {count} {count === 1 ? "product" : "products"}
          </p>
        ) : null}

        {large && category.description ? (
          <p className="line-clamp-2-safe mt-2 text-sm leading-relaxed text-ink-500">
            {category.description}
          </p>
        ) : null}

        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-chilli-600">
          Shop now
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
