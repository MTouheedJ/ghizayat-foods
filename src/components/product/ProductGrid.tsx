import ProductCard from "./ProductCard";
import { RevealItem } from "@/components/ui/Reveal";
import Reveal from "@/components/ui/Reveal";
import { cx } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

/** Looks up each product's category accent so cards stay colour-coordinated. */
function accentMap(categories: Category[]): Record<string, Category["accent"]> {
  return categories.reduce<Record<string, Category["accent"]>>(
    (acc, category) => {
      acc[category.slug] = category.accent;
      return acc;
    },
    {},
  );
}

export default function ProductGrid({
  products,
  categories = [],
  className,
  /** Marks the first N images as priority for LCP on above-the-fold grids. */
  priorityCount = 0,
  animate = true,
}: {
  products: Product[];
  categories?: Category[];
  className?: string;
  priorityCount?: number;
  animate?: boolean;
}) {
  const accents = accentMap(categories);

  const grid = cx(
    "grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4",
    className,
  );

  if (!animate) {
    return (
      <ul className={grid}>
        {products.map((product, index) => (
          <li key={product.id}>
            <ProductCard
              product={product}
              accent={accents[product.category.slug]}
              priority={index < priorityCount}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Reveal as="ul" stagger={0.05} className={grid}>
      {products.map((product, index) => (
        <RevealItem as="li" key={product.id}>
          <ProductCard
            product={product}
            accent={accents[product.category.slug]}
            priority={index < priorityCount}
          />
        </RevealItem>
      ))}
    </Reveal>
  );
}
