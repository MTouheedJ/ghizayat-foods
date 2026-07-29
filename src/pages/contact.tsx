import type { GetStaticProps } from "next";
import Link from "next/link";

import Seo, { breadcrumbSchema, localBusinessSchema } from "@/components/Seo";
import EnquiryForm from "@/components/forms/EnquiryForm";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { getAllCategories } from "@/lib/data";
import { REVALIDATE_SECONDS, SITE } from "@/lib/site";
import type { Category } from "@/lib/types";

export default function ContactPage() {
  const telHref = `tel:${SITE.phone.replace(/[^+\d]/g, "")}`;

  const CHANNELS = [
    {
      label: "Call the shop",
      value: SITE.phone,
      href: telHref,
      note: SITE.hours,
      path: "M4 5c0 8.3 6.7 15 15 15l1.5-3.2-4-1.8-1.6 1.9a12 12 0 0 1-5.3-5.3l1.9-1.6-1.8-4L6 4Z",
    },
    {
      label: "WhatsApp",
      value: "Message us",
      href: `https://wa.me/${SITE.whatsapp}`,
      note: "Fastest for order updates",
      path: "M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Z",
    },
    {
      label: "Email",
      value: SITE.email,
      href: `mailto:${SITE.email}`,
      note: "Replies within one working day",
      path: "M3 6h18v12H3zM3 7l9 6 9-6",
    },
  ];

  return (
    <>
      <Seo
        title="Contact Us"
        description={`Call ${SITE.phone}, message us on WhatsApp, or visit our shop in ${SITE.address.city}. Open ${SITE.hours}.`}
        canonicalPath="/contact"
        jsonLd={[
          localBusinessSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />

      <PageHeader
        title="Get in touch"
        description="Call, message or walk in. Someone who actually knows the stock will answer."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Channels */}
        <Reveal className="grid gap-4 sm:grid-cols-3">
          {CHANNELS.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
              rel={
                channel.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="group rounded-2xl border border-cream-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-chilli-300 hover:shadow-lg"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-chilli-50 text-chilli-600 transition group-hover:bg-chilli-600 group-hover:text-white">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={channel.path} />
                </svg>
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-ink-400">
                {channel.label}
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-ink-900">
                {channel.value}
              </p>
              <p className="mt-0.5 text-xs text-ink-400">{channel.note}</p>
            </a>
          ))}
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          {/* Form */}
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-ink-900">
              Send us a message
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              Questions about an order, a product, or something you cannot find
              on the site.
            </p>
            <div className="mt-6">
              <EnquiryForm kind="contact" />
            </div>
          </Reveal>

          {/* Visit */}
          <Reveal delay={0.1}>
            <h2 className="font-display text-2xl font-bold text-ink-900">
              Visit the shop
            </h2>

            <div className="mt-6 rounded-2xl border border-cream-200 bg-white p-6">
              <address className="space-y-4 text-sm not-italic text-ink-600">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-400">
                    Address
                  </p>
                  <p className="mt-1.5 leading-relaxed">
                    {SITE.address.street}
                    <br />
                    {SITE.address.city}, {SITE.address.region}{" "}
                    {SITE.address.postalCode}
                    <br />
                    Pakistan
                  </p>
                </div>

                <div className="border-t border-cream-200 pt-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-400">
                    Opening hours
                  </p>
                  <p className="mt-1.5">{SITE.hours}</p>
                </div>
              </address>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${SITE.address.street}, ${SITE.address.city}, Pakistan`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-royal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-royal-800"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                Open in Google Maps
              </a>
            </div>

            <div className="mt-5 rounded-2xl border border-royal-200 bg-royal-50 p-5">
              <h3 className="font-display text-base font-semibold text-royal-900">
                Buying in bulk?
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-royal-900/70">
                Restaurants, caterers and retailers get separate rates and
                credit terms. Use the wholesale form instead.
              </p>
              <Link
                href="/bulk-orders"
                className="mt-3 inline-block text-sm font-semibold text-royal-700 underline transition hover:text-royal-900"
              >
                Go to bulk orders →
              </Link>
            </div>
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
