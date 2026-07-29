import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import SpiceTin from "./SpiceTin";

/**
 * Hero.
 *
 * Deliberately static: no WebGL, no canvas, no lazy-loaded scene. Everything
 * here is server-rendered HTML/SVG and CSS, so the first paint is the final
 * paint. The only motion is a one-time entrance fade, which collapses to
 * nothing when the visitor asks for reduced motion.
 */

const STATS = [
  { value: "40+", label: "Spices & grains" },
  { value: "62", label: "Years of trade" },
  { value: "24h", label: "Lahore delivery" },
];

export default function Hero() {
  const reduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative overflow-hidden bg-ink-900 text-cream-50">
      {/* Brand ground — paints instantly, before any JS runs. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_12%_8%,#741529_0%,transparent_55%),radial-gradient(95%_75%_at_88%_30%,#1c2c85_0%,transparent_62%),linear-gradient(180deg,#12100e_0%,#1d1916_100%)]" />
        <div className="bg-grain absolute inset-0 opacity-40 mix-blend-overlay" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:px-8 lg:pb-28 lg:pt-24">
        {/* ── Copy ───────────────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: reduceMotion ? 0 : 0.08 }}
          className="max-w-xl"
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-cream-50/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium tracking-wide text-cream-200 backdrop-blur"
          >
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-saffron-400"
            />
            Ground fresh this week in Lahore
          </motion.p>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4rem]"
          >
            The spice rack
            <br />
            your grandmother
            <span className="block bg-gradient-to-r from-chilli-400 via-saffron-400 to-royal-400 bg-clip-text text-transparent">
              would approve of.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-lg text-base leading-relaxed text-cream-200/80 sm:text-lg"
          >
            Stone-ground masalas, hand-graded dry fruits and aged Punjab
            basmati — bought direct from the growers, milled in small batches
            and delivered to your door. Cash on delivery, everywhere in
            Pakistan.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-chilli-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-glow)] transition hover:bg-chilli-500 active:scale-[0.98]"
            >
              Shop all products
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.3}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </Link>

            <Link
              href="/bulk-orders"
              className="inline-flex items-center gap-2 rounded-full border border-cream-50/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-cream-100 backdrop-blur transition hover:border-cream-50/40 hover:bg-white/10"
            >
              Bulk &amp; wholesale
            </Link>
          </motion.div>

          <motion.dl
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-cream-50/10 pt-7"
          >
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-2xl font-bold text-cream-50 sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="mt-0.5 block text-xs text-cream-200/60">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* ── Masala dabba ───────────────────────────────────────────────── */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          {/* Warm and cool blooms behind the tin, tying it to the brand. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute left-1/4 top-1/4 h-2/3 w-2/3 -translate-x-1/4 rounded-full bg-chilli-600/25 blur-3xl" />
            <div className="absolute bottom-1/4 right-0 h-2/3 w-2/3 rounded-full bg-royal-600/25 blur-3xl" />
          </div>

          <SpiceTin className="relative h-auto w-full drop-shadow-2xl" />

          {/* Caption card */}
          <div className="relative mx-auto mt-6 flex max-w-sm items-center gap-3 rounded-2xl border border-cream-50/12 bg-white/[0.06] px-4 py-3 backdrop-blur">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-saffron-500/20 text-saffron-300">
              <svg
                viewBox="0 0 24 24"
                className="h-4.5 w-4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.9}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3v18M5 7l-3 7h6zM19 7l-3 7h6zM7 21h10M6 7h12" />
              </svg>
            </span>
            <p className="text-sm leading-snug text-cream-200/85">
              Seven masalas, milled this week — weighed on calibrated scales and
              sealed the day they ship.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Curved transition into the cream page body */}
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="relative block h-10 w-full sm:h-14"
      >
        <path d="M0 80V32c240 32 480 44 720 34s480-38 720-66v80Z" fill="#fefaf6" />
      </svg>
    </section>
  );
}
