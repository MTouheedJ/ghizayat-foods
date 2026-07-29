import Link from "next/link";

import Logo from "@/components/ui/Logo";
import { SITE } from "@/lib/site";
import type { Category } from "@/lib/types";

const HELP_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/bulk-orders", label: "Bulk Orders" },
  { href: "/shop", label: "All Products" },
];

const POLICY_LINKS = [
  { href: "/delivery-and-returns", label: "Delivery & Returns" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

const SOCIALS = [
  {
    href: SITE.social.facebook,
    label: "Facebook",
    path: "M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1Z",
  },
  {
    href: SITE.social.instagram,
    label: "Instagram",
    path: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM17.5 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z",
  },
  {
    href: SITE.social.youtube,
    label: "YouTube",
    path: "M21.5 8.5a3 3 0 0 0-2.1-2.1C17.6 6 12 6 12 6s-5.6 0-7.4.4A3 3 0 0 0 2.5 8.5 31 31 0 0 0 2 12c0 1.2.1 2.4.5 3.5a3 3 0 0 0 2.1 2.1C6.4 18 12 18 12 18s5.6 0 7.4-.4a3 3 0 0 0 2.1-2.1c.4-1.1.5-2.3.5-3.5s-.1-2.4-.5-3.5ZM10 15V9l5 3-5 3Z",
  },
];

export default function Footer({ categories }: { categories: Category[] }) {
  const year = new Date().getFullYear();
  const whatsappHref = `https://wa.me/${SITE.whatsapp}`;

  return (
    <footer className="relative mt-24 overflow-hidden bg-ink-900 text-cream-200">
      {/* Ambient brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
      >
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-chilli-700/25 blur-3xl" />
        <div className="absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-royal-700/25 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo invert />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream-300/75">
              {SITE.description}
            </p>

            <div className="mt-6 flex gap-2.5">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-300/15 bg-white/5 text-cream-200 transition hover:border-chilli-500/50 hover:bg-chilli-600 hover:text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4.5 w-4.5"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-base font-semibold text-cream-50">
              Shop
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.slice(0, 7).map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="text-cream-300/70 transition hover:text-chilli-300"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-base font-semibold text-cream-50">
              Help
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {HELP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream-300/70 transition hover:text-chilli-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-base font-semibold text-cream-50">
              Visit &amp; Contact
            </h3>
            <address className="mt-4 space-y-3 text-sm not-italic text-cream-300/70">
              <p>
                {SITE.address.street}
                <br />
                {SITE.address.city}, {SITE.address.region}
              </p>
              <p>
                <a
                  href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`}
                  className="transition hover:text-chilli-300"
                >
                  {SITE.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="transition hover:text-chilli-300"
                >
                  {SITE.email}
                </a>
              </p>
              <p className="text-cream-300/55">{SITE.hours}</p>
            </address>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-leaf-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-leaf-700"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.5-.6a11 11 0 0 1-4.3-4.4c-.3-.6-.5-1.1-.5-1.6 0-.5.2-1 .5-1.3.2-.2.4-.3.6-.3h.5c.2 0 .4 0 .5.4l.7 1.7c0 .2 0 .3-.1.4l-.3.4-.2.2c-.1.1-.2.3 0 .5a8 8 0 0 0 3.5 3c.3.1.4.1.6-.1l.7-.8c.2-.2.3-.2.5-.1l1.7.8c.2.1.3.2.4.3v.7Z" />
              </svg>
              Order on WhatsApp
            </a>
          </div>
        </div>

        {/* Payment / trust strip */}
        <div className="mt-14 flex flex-col items-center gap-5 border-t border-cream-300/10 pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-cream-300/55">
            © {year} {SITE.name}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-cream-300/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-cream-200">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-leaf-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m5 13 4 4L19 7" />
              </svg>
              Cash on Delivery
            </span>
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-cream-300/55">
              {POLICY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-chilli-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
