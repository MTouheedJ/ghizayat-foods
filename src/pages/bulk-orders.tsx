import type { GetStaticProps } from "next";

import Seo, { breadcrumbSchema } from "@/components/Seo";
import EnquiryForm from "@/components/forms/EnquiryForm";
import PageHeader from "@/components/ui/PageHeader";
import Reveal, { RevealItem } from "@/components/ui/Reveal";
import { getAllCategories } from "@/lib/data";
import { REVALIDATE_SECONDS, SITE } from "@/lib/site";
import type { Category } from "@/lib/types";

const BENEFITS = [
  {
    title: "Mandi-linked pricing",
    body: "Bulk rates track the wholesale market, reviewed weekly. You are not paying a retail margin on a 50 kg sack.",
  },
  {
    title: "Consistent grade, every drop",
    body: "We reserve stock from a single lot for contract customers, so the biryani you serve in March tastes like the one in September.",
  },
  {
    title: "Credit terms",
    body: "Established accounts run on 15- or 30-day terms after the first three orders settle on delivery.",
  },
  {
    title: "Custom grinds & packing",
    body: "Coarse or fine, 5 kg foil or 25 kg sack, your label or ours. Tell us the spec and we will mill to it.",
  },
  {
    title: "One named contact",
    body: "A direct mobile number for a person who knows your account, not a call centre queue.",
  },
  {
    title: "Scheduled deliveries",
    body: "Standing weekly or monthly drops so you are never reordering in a panic on a Friday night.",
  },
];

const SERVES = [
  "Restaurants & hotels",
  "Wedding caterers",
  "Retail & kiryana stores",
  "Food manufacturers",
  "Corporate canteens",
  "Export houses",
];

export default function BulkOrdersPage() {
  return (
    <>
      <Seo
        title="Bulk & Wholesale Orders"
        description={`Wholesale spices, rice, pulses and dry fruits from ${SITE.name}. Mandi-linked pricing, custom grinds, credit terms and scheduled delivery for restaurants, caterers and retailers across Pakistan.`}
        canonicalPath="/bulk-orders"
        jsonLd={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Bulk Orders", path: "/bulk-orders" },
          ]),
        ]}
      />

      <PageHeader
        title="Bulk & wholesale"
        description="We have supplied Lahore's kitchens by the sack for six decades. Here is how it works."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Bulk Orders", path: "/bulk-orders" },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Who we serve */}
        <Reveal className="flex flex-wrap gap-2.5">
          {SERVES.map((item) => (
            <span
              key={item}
              className="rounded-full border border-cream-300 bg-white px-4 py-2 text-sm font-medium text-ink-600"
            >
              {item}
            </span>
          ))}
        </Reveal>

        {/* Benefits */}
        <Reveal
          as="ul"
          stagger={0.06}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {BENEFITS.map((benefit) => (
            <RevealItem
              as="li"
              key={benefit.title}
              className="rounded-2xl border border-cream-200 bg-white p-6"
            >
              <h3 className="font-display text-lg font-semibold text-ink-900">
                {benefit.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">
                {benefit.body}
              </p>
            </RevealItem>
          ))}
        </Reveal>

        {/* Form */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">
              Request a rate sheet
            </h2>
            <p className="mt-2 max-w-lg text-sm text-ink-500">
              Tell us roughly what you need and how often. Our wholesale desk
              calls back within one working day with current rates.
            </p>
            <div className="mt-6">
              <EnquiryForm kind="bulk" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="bg-brand-sweep relative overflow-hidden rounded-2xl p-7 text-cream-50">
              <div
                aria-hidden="true"
                className="bg-grain pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
              />
              <div className="relative">
                <h3 className="font-display text-xl font-bold">
                  Prefer to talk it through?
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-cream-100/80">
                  Wholesale enquiries are handled by a person, not a form. Call
                  during shop hours and ask for the bulk desk.
                </p>

                <a
                  href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`}
                  className="mt-5 block rounded-xl bg-cream-50 px-5 py-3.5 text-center text-sm font-bold text-ink-900 transition hover:bg-white"
                >
                  {SITE.phone}
                </a>

                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block rounded-xl border border-cream-50/30 px-5 py-3.5 text-center text-sm font-semibold transition hover:bg-white/10"
                >
                  WhatsApp the bulk desk
                </a>

                <p className="mt-5 text-xs text-cream-200/60">{SITE.hours}</p>
              </div>
            </div>

            <dl className="mt-6 space-y-4 rounded-2xl border border-cream-200 bg-white p-6 text-sm">
              <div>
                <dt className="font-semibold text-ink-800">
                  Minimum bulk order
                </dt>
                <dd className="mt-1 text-ink-500">
                  25 kg per line item, mixed across products.
                </dd>
              </div>
              <div className="border-t border-cream-200 pt-4">
                <dt className="font-semibold text-ink-800">Lead time</dt>
                <dd className="mt-1 text-ink-500">
                  Stock items ship next day. Custom grinds take two to three
                  days.
                </dd>
              </div>
              <div className="border-t border-cream-200 pt-4">
                <dt className="font-semibold text-ink-800">Payment</dt>
                <dd className="mt-1 text-ink-500">
                  Cash on delivery to start; credit terms once the account is
                  established.
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
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
