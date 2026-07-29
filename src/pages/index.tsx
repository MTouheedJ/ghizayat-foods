import Link from "next/link";
import type { GetStaticProps } from "next";

import Seo, {
  localBusinessSchema,
  organizationSchema,
  websiteSchema,
} from "@/components/Seo";
import Hero from "@/components/home/Hero";
import ProcessSection from "@/components/home/ProcessSection";
import Testimonials from "@/components/home/Testimonials";
import TrustBar from "@/components/home/TrustBar";
import CategoryCard from "@/components/product/CategoryCard";
import ProductGrid from "@/components/product/ProductGrid";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { countByCategory, getAllCategories, getAllProducts } from "@/lib/data";
import { REVALIDATE_SECONDS } from "@/lib/site";
import type { Category, Product } from "@/lib/types";

type Props = {
  categories: Category[];
  trending: Product[];
  newArrivals: Product[];
  counts: Record<string, number>;
  totalProducts: number;
};

export default function HomePage({
  categories,
  trending,
  newArrivals,
  counts,
  totalProducts,
}: Props) {
  return (
    <>
      <Seo
        description={`Shop ${totalProducts}+ spices, dry fruits, pulses, rice and pure ghee from Ghizayat Foods. Ground in small batches, delivered across Pakistan with cash on delivery.`}
        jsonLd={[organizationSchema(), websiteSchema(), localBusinessSchema()]}
      />

      <Hero />
      <TrustBar />

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          eyebrow="Shop by category"
          title="Everything a Pakistani kitchen runs on"
          description="Seven aisles, all of them stocked from the same growers we have bought from for decades."
          href="/categories"
          linkLabel="All categories"
        />

        <Reveal
          as="ul"
          stagger={0.06}
          className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
        >
          {categories.map((category) => (
            <RevealItem as="li" key={category.id}>
              <CategoryCard
                category={category}
                count={counts[category.slug] ?? 0}
              />
            </RevealItem>
          ))}
        </Reveal>
      </section>

      {/* ── Trending ─────────────────────────────────────────────────────── */}
      {trending.length > 0 ? (
        <section className="bg-white/70 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Moving fast"
              title="Trending this week"
              description="What our regulars are reordering most often right now."
              href="/shop?sort=trending"
              linkLabel="See all"
            />
            <div className="mt-12">
              <ProductGrid products={trending} categories={categories} />
            </div>
          </div>
        </section>
      ) : null}

      <ProcessSection />

      {/* ── Bulk banner ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal
          direction="scale"
          className="bg-brand-sweep relative overflow-hidden rounded-3xl px-6 py-14 text-center text-cream-50 sm:px-12 sm:py-20"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-saffron-400/20 blur-3xl" />
            <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-royal-400/25 blur-3xl" />
            <div className="bg-grain absolute inset-0 opacity-30 mix-blend-overlay" />
          </div>

          <div className="relative mx-auto max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-saffron-300">
              For restaurants, caterers &amp; retailers
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-[2.75rem]">
              Buying by the sack, not the packet?
            </h2>
            <p className="mt-5 text-base leading-relaxed text-cream-100/80 sm:text-lg">
              We supply hotels, wedding caterers and neighbourhood shops on
              standing monthly orders — at mandi rates, with credit terms and a
              dedicated line you can actually get through on.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/bulk-orders"
                className="rounded-full bg-cream-50 px-7 py-3.5 text-sm font-bold text-ink-900 transition hover:bg-white active:scale-[0.98]"
              >
                Request bulk pricing
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-cream-50/30 px-7 py-3.5 text-sm font-semibold text-cream-50 transition hover:bg-white/10"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── New arrivals ─────────────────────────────────────────────────── */}
      {newArrivals.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <SectionHeading
            eyebrow="Just in"
            title="New on the shelf"
            href="/shop?sort=newest"
            linkLabel="Browse new"
          />
          <div className="mt-12">
            <ProductGrid products={newArrivals} categories={categories} />
          </div>
        </section>
      ) : null}

      <Testimonials />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  const trending = products.filter((product) => product.isTrending).slice(0, 8);
  const newArrivals = products
    .filter((product) => product.isNewArrival)
    .slice(0, 4);

  return {
    props: {
      categories,
      // Fall back to the first few products so these sections are never empty
      // on a freshly-seeded dataset where no flags have been ticked yet.
      trending: trending.length > 0 ? trending : products.slice(0, 8),
      newArrivals: newArrivals.length > 0 ? newArrivals : products.slice(8, 12),
      counts: countByCategory(products),
      totalProducts: products.length,
    },
    revalidate: REVALIDATE_SECONDS,
  };
};
