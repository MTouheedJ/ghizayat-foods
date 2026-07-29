import Link from "next/link";
import type { GetStaticProps } from "next";

import Seo from "@/components/Seo";
import { getAllCategories } from "@/lib/data";
import { REVALIDATE_SECONDS } from "@/lib/site";
import type { Category } from "@/lib/types";

export default function NotFoundPage({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <>
      <Seo title="Page Not Found" noIndex />

      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 sm:py-32">
        <p className="font-display text-[6rem] font-bold leading-none text-gradient-brand sm:text-[9rem]">
          404
        </p>

        <h1 className="mt-4 font-display text-3xl font-bold text-ink-900 sm:text-4xl">
          This shelf is empty
        </h1>
        <p className="mx-auto mt-3 max-w-md text-ink-500">
          The page you were looking for has moved or never existed. The spices,
          however, are exactly where you left them.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/shop"
            className="rounded-full bg-chilli-600 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-chilli-700"
          >
            Browse the shop
          </Link>
          <Link
            href="/"
            className="rounded-full border border-cream-300 bg-white px-7 py-3.5 text-sm font-semibold text-ink-700 transition hover:border-chilli-400 hover:text-chilli-700"
          >
            Back home
          </Link>
        </div>

        {categories.length > 0 ? (
          <div className="mt-14">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-400">
              Or jump to a category
            </p>
            <ul className="mt-4 flex flex-wrap justify-center gap-2.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="inline-block rounded-full border border-cream-300 bg-white px-4 py-2 text-sm text-ink-600 transition hover:border-chilli-400 hover:text-chilli-700"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
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
