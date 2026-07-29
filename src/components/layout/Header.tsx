import Link from "next/link";
import { useRouter } from "next/router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import Logo from "@/components/ui/Logo";
import { useCart } from "@/lib/cart";
import { cx } from "@/lib/format";
import { NAV_LINKS, SITE } from "@/lib/site";
import type { Category } from "@/lib/types";

const ANNOUNCEMENTS = [
  "Free delivery on orders over Rs 5,000",
  "Cash on delivery across Pakistan",
  "Mill-fresh spices, ground in small batches",
  "Bulk rates available for hotels & retailers",
];

export default function Header({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { itemCount, isReady, lastAddedAt } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [bump, setBump] = useState(false);
  const previousCount = useRef(0);

  // Shrink the bar once the user leaves the very top of the page.
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on navigation.
  useEffect(() => {
    const close = () => setIsMenuOpen(false);
    router.events.on("routeChangeStart", close);
    return () => router.events.off("routeChangeStart", close);
  }, [router.events]);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Pop the cart badge when a line is added.
  useEffect(() => {
    if (lastAddedAt > previousCount.current) {
      previousCount.current = lastAddedAt;
      setBump(true);
      const timer = window.setTimeout(() => setBump(false), 420);
      return () => window.clearTimeout(timer);
    }
  }, [lastAddedAt]);

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = query.trim();
    router.push(term ? `/shop?q=${encodeURIComponent(term)}` : "/shop");
  }

  const navCategories = categories.slice(0, 7);

  return (
    <>
      {/* ── Announcement marquee ───────────────────────────────────────── */}
      <div className="bg-brand-sweep relative overflow-hidden text-cream-50">
        <div className="scrollbar-none flex overflow-hidden py-2">
          <div
            className={cx(
              "flex shrink-0 items-center gap-10 whitespace-nowrap px-5 text-xs font-medium tracking-wide",
              !reduceMotion && "animate-[marquee_40s_linear_infinite]",
            )}
          >
            {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((text, index) => (
              <span key={index} className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 rounded-full bg-saffron-400"
                />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main bar ───────────────────────────────────────────────────── */}
      <header
        className={cx(
          "sticky top-0 z-50 border-b transition-all duration-300",
          isScrolled
            ? "border-cream-300/70 bg-cream-50/90 shadow-sm backdrop-blur-xl"
            : "border-transparent bg-cream-50",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:gap-5 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            className="-ml-1 rounded-lg p-2 text-ink-700 transition hover:bg-cream-200 lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          <Link
            href="/"
            className={cx(
              "group flex shrink-0 items-center transition-all duration-300",
              isScrolled ? "py-3" : "py-4",
            )}
          >
            <Logo />
          </Link>

          {/* Search — the primary way people find a spice by name */}
          <form
            onSubmit={onSearch}
            role="search"
            className="ml-auto hidden max-w-md flex-1 lg:ml-6 lg:block"
          >
            <div className="group relative">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400 transition group-focus-within:text-chilli-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.2-3.2" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search haldi, badam, basmati…"
                aria-label="Search products"
                className="w-full rounded-full border border-cream-300 bg-white/70 py-2.5 pl-11 pr-4 text-sm text-ink-800 placeholder:text-ink-400 transition focus:border-chilli-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-chilli-500/10"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1 lg:ml-0 lg:gap-2">
            <Link
              href="/shop"
              aria-label="Search products"
              className="rounded-lg p-2.5 text-ink-700 transition hover:bg-cream-200 lg:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.2-3.2" />
              </svg>
            </Link>

            <a
              href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`}
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-cream-200 xl:flex"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-chilli-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 5c0 8.3 6.7 15 15 15l1.5-3.2-4-1.8-1.6 1.9a12 12 0 0 1-5.3-5.3l1.9-1.6-1.8-4L6 4Z" />
              </svg>
              {SITE.phone}
            </a>

            <Link
              href="/cart"
              aria-label={`Cart, ${isReady ? itemCount : 0} items`}
              className="relative rounded-lg p-2.5 text-ink-700 transition hover:bg-cream-200"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5.5 w-5.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.9}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 4h2.2l2 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.55L20.5 8H6.2" />
                <circle cx="10" cy="20" r="1.4" />
                <circle cx="17.5" cy="20" r="1.4" />
              </svg>
              {isReady && itemCount > 0 ? (
                <span
                  className={cx(
                    "absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-chilli-600 px-1 text-[0.68rem] font-bold text-white shadow transition-transform duration-200",
                    bump && !reduceMotion && "scale-125",
                  )}
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>

        {/* ── Category strip (desktop) ─────────────────────────────────── */}
        <nav
          aria-label="Categories"
          className="hidden border-t border-cream-200 lg:block"
        >
          <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? router.pathname === "/"
                  : router.asPath.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cx(
                    "relative px-3.5 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "text-chilli-700"
                      : "text-ink-600 hover:text-chilli-600",
                  )}
                >
                  {link.label}
                  {isActive ? (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-chilli-600"
                      transition={{ duration: reduceMotion ? 0 : 0.3 }}
                    />
                  ) : null}
                </Link>
              );
            })}

            <span className="mx-2 h-4 w-px bg-cream-300" aria-hidden="true" />

            <div className="scrollbar-none flex items-center gap-1 overflow-x-auto">
              {navCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="whitespace-nowrap rounded-full px-3 py-1.5 text-[0.82rem] text-ink-500 transition hover:bg-chilli-50 hover:text-chilli-700"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* ── Mobile drawer ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 h-full w-full bg-ink-900/50 backdrop-blur-sm"
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-cream-50 shadow-2xl"
              initial={{ x: reduceMotion ? 0 : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: reduceMotion ? 0 : "-100%" }}
              transition={{
                duration: reduceMotion ? 0 : 0.32,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex items-center justify-between border-b border-cream-200 px-5 py-4">
                <Logo />
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                  className="rounded-lg p-2 text-ink-600 transition hover:bg-cream-200"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4">
                <form onSubmit={onSearch} role="search" className="px-2 pb-4">
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search products…"
                    aria-label="Search products"
                    className="w-full rounded-xl border border-cream-300 bg-white px-4 py-3 text-sm placeholder:text-ink-400 focus:border-chilli-400 focus:outline-none focus:ring-4 focus:ring-chilli-500/10"
                  />
                </form>

                <ul className="space-y-0.5">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block rounded-xl px-4 py-3 font-medium text-ink-800 transition hover:bg-cream-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                {navCategories.length > 0 ? (
                  <>
                    <p className="px-4 pb-2 pt-6 text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">
                      Shop by category
                    </p>
                    <ul className="space-y-0.5">
                      {navCategories.map((category) => (
                        <li key={category.slug}>
                          <Link
                            href={`/categories/${category.slug}`}
                            className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm text-ink-600 transition hover:bg-cream-200"
                          >
                            {category.title}
                            {category.localTitle ? (
                              <span className="font-urdu text-sm text-ink-400">
                                {category.localTitle}
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>

              <div className="border-t border-cream-200 p-4">
                <a
                  href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-chilli-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-chilli-700"
                >
                  Call to order · {SITE.phone}
                </a>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
