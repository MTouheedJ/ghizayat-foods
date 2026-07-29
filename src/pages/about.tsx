import type { GetStaticProps } from "next";
import Link from "next/link";

import Seo, { breadcrumbSchema, organizationSchema } from "@/components/Seo";
import PageHeader from "@/components/ui/PageHeader";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { getAllCategories } from "@/lib/data";
import { REVALIDATE_SECONDS, SITE } from "@/lib/site";
import type { Category } from "@/lib/types";

const MILESTONES = [
  {
    year: "1962",
    title: "A stall on Circular Road",
    body: "Three sacks of chilli, one set of brass scales, and a spot near Akbari Gate that we still trade from today.",
  },
  {
    year: "1984",
    title: "Our first mill",
    body: "We stopped buying ground masala from others and started grinding our own on slow stone mills. Customers noticed within a month.",
  },
  {
    year: "2001",
    title: "Buying at source",
    body: "Direct purchasing began in Kunri, Quetta and Gilgit. Cutting the middle layers out is what let us hold quality and still compete on price.",
  },
  {
    year: "2019",
    title: "Supplying kitchens at scale",
    body: "Hotels, wedding caterers and retail chains came on standing monthly contracts. Bulk became half the business.",
  },
  {
    year: "Today",
    title: "At your door",
    body: "The same shop, the same scales, now delivering nationwide with cash on delivery.",
  },
];

const VALUES = [
  {
    title: "We do not blend to hide",
    body: "No rice flour in the chilli, no cassia sold as cinnamon, no last season's stock mixed into this season's. If a lot fails the grade it is sold as feed, not as food.",
  },
  {
    title: "Small batches, always",
    body: "Grinding weekly costs us more than grinding quarterly. It also means the masala you open still smells of the spice rather than the sack.",
  },
  {
    title: "Weights you can check",
    body: "Calibrated digital scales, printed weight on every pack. Weigh it at home — that is the point.",
  },
  {
    title: "Pay when it arrives",
    body: "Cash on delivery, everywhere. You should not have to trust a website with money before you have seen the goods.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About Us"
        description={`${SITE.name} has been trading spices, dry fruits and grains from Lahore since 1962 — bought at source, milled in small batches and delivered nationwide.`}
        canonicalPath="/about"
        jsonLd={[
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      <PageHeader
        title="Sixty-two years on the same road"
        description="We are a family spice house from Lahore. What follows is genuinely how we work — not a mission statement written by an agency."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-chilli-600">
              Our story
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-ink-900 sm:text-[2.5rem]">
              It started with three sacks of chilli
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="space-y-5 text-base leading-[1.85] text-ink-600">
            <p>
              Our grandfather opened a stall near Akbari Gate in 1962 with three
              sacks of Kunri chilli and a set of brass scales. He had one rule,
              which he repeated often enough that it became the family
              business: never sell something you would not cook with at home.
            </p>
            <p>
              That sounds like a slogan now. At the time it was a commercial
              decision, and an unpopular one. The trade around us was built on
              blending — a little rice flour into the chilli powder, cheaper
              cassia bark sold as Ceylon cinnamon, last season&rsquo;s turmeric
              mixed into this season&rsquo;s. It was normal. He refused, charged
              more, and for a few years sold less.
            </p>
            <p>
              Then the restaurants started coming. A chef can taste the
              difference between chilli that is 100% chilli and chilli that is
              80% chilli, and once they could taste it they would not go back.
              Six decades later, some of those kitchens are still on our books —
              now run by the grandchildren of the men who first walked in.
            </p>
            <p>
              We have added mills, a warehouse and a website. We have not added
              anything to the masala.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white/70 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Milestones" title="How we got here" />

          <Reveal as="ul" stagger={0.08} className="mt-12 space-y-0">
            {MILESTONES.map((milestone) => (
              <RevealItem
                as="li"
                key={milestone.year}
                className="relative grid gap-3 border-l-2 border-cream-300 pb-10 pl-8 last:pb-0 sm:grid-cols-[7rem_1fr] sm:gap-6"
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[0.4375rem] top-1.5 h-3 w-3 rounded-full bg-chilli-600 ring-4 ring-cream-50"
                />
                <span className="font-display text-xl font-bold text-chilli-700">
                  {milestone.year}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink-900">
                    {milestone.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                    {milestone.body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="What we will not do"
          title="Four commitments, plainly stated"
        />

        <Reveal as="ul" stagger={0.08} className="mt-12 grid gap-5 sm:grid-cols-2">
          {VALUES.map((value) => (
            <RevealItem
              as="li"
              key={value.title}
              className="rounded-2xl border border-cream-200 bg-white p-6"
            >
              <h3 className="font-display text-lg font-semibold text-ink-900">
                {value.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">
                {value.body}
              </p>
            </RevealItem>
          ))}
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <Reveal
          direction="scale"
          className="bg-brand-sweep relative overflow-hidden rounded-3xl px-6 py-14 text-center text-cream-50 sm:px-12"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="bg-grain absolute inset-0 opacity-30 mix-blend-overlay" />
          </div>
          <div className="relative">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Come taste the difference
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cream-100/80">
              Start with the garam masala. If it is not noticeably better than
              what you are using now, tell us and we will refund it.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-block rounded-full bg-cream-50 px-7 py-3.5 text-sm font-bold text-ink-900 transition hover:bg-white"
            >
              Browse the shop
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps<{
  categories: Category[];
}> = async () => ({
  props: { categories: await getAllCategories() },
  revalidate: REVALIDATE_SECONDS,
});
