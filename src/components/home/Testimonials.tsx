import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import SectionHeading from "@/components/ui/SectionHeading";
import { cx } from "@/lib/format";

const REVIEWS = [
  {
    quote:
      "I have been buying garam masala from the same shop in Akbari Mandi for twenty years. This is the first time I have ordered online and not regretted it — the smell when you open the bag tells you everything.",
    name: "Farah Siddiqui",
    role: "Home cook, Karachi",
    accent: "chilli" as const,
  },
  {
    quote:
      "We run a 60-cover restaurant and go through 40kg of basmati a week. The grain length is consistent bag to bag, which matters more than the price. Delivery has never once been late.",
    name: "Imran Bhatti",
    role: "Head Chef, Lahore",
    accent: "royal" as const,
  },
  {
    quote:
      "Ordered the Hunza apricots and chilgoza for my mother. She said they tasted like the ones from Gilgit when she was young. That is the highest praise you will get in our house.",
    name: "Ayesha Noor",
    role: "Islamabad",
    accent: "saffron" as const,
  },
  {
    quote:
      "The desi ghee actually grains as it cools, which is how you know it is real. I had almost given up finding it in the city.",
    name: "Tariq Mahmood",
    role: "Rawalpindi",
    accent: "chilli" as const,
  },
];

const ACCENT_BAR: Record<string, string> = {
  chilli: "bg-chilli-600",
  royal: "bg-royal-700",
  saffron: "bg-saffron-500",
};

export default function Testimonials() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <section className="relative overflow-hidden bg-ink-900 py-20 text-cream-50 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-chilli-700/20 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-royal-800/25 blur-3xl" />
        <div className="bg-grain absolute inset-0 opacity-30 mix-blend-overlay" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What people say"
          title="Trusted in kitchens across Pakistan"
          description="Sixty-two years of trade, and the same customers keep coming back."
          align="center"
          invert
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          {/* Active quote */}
          <motion.blockquote
            key={active}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl border border-cream-50/10 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-10"
          >
            <svg
              viewBox="0 0 48 48"
              aria-hidden="true"
              className="h-10 w-10 text-chilli-500/50"
              fill="currentColor"
            >
              <path d="M18 10c-6 3-10 9-10 16 0 6 3 10 8 10 4 0 7-3 7-7s-3-7-6-7h-1c0-4 2-7 6-9l-4-3Zm20 0c-6 3-10 9-10 16 0 6 3 10 8 10 4 0 7-3 7-7s-3-7-6-7h-1c0-4 2-7 6-9l-4-3Z" />
            </svg>

            <p className="mt-5 font-display text-xl leading-relaxed text-cream-100 sm:text-2xl sm:leading-relaxed">
              {REVIEWS[active].quote}
            </p>

            <footer className="mt-7 flex items-center gap-3.5">
              <span
                className={cx(
                  "flex h-11 w-11 items-center justify-center rounded-full font-display text-base font-bold text-white",
                  ACCENT_BAR[REVIEWS[active].accent],
                )}
                aria-hidden="true"
              >
                {REVIEWS[active].name.charAt(0)}
              </span>
              <div>
                <cite className="block font-semibold not-italic text-cream-50">
                  {REVIEWS[active].name}
                </cite>
                <span className="text-sm text-cream-200/60">
                  {REVIEWS[active].role}
                </span>
              </div>
            </footer>
          </motion.blockquote>

          {/* Selector */}
          <ul className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {REVIEWS.map((review, index) => (
              <li key={review.name} className="min-w-[13rem] flex-1 lg:min-w-0">
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-current={index === active}
                  className={cx(
                    "relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300",
                    index === active
                      ? "border-chilli-500/50 bg-white/[0.07]"
                      : "border-cream-50/10 bg-white/[0.02] hover:border-cream-50/25 hover:bg-white/[0.05]",
                  )}
                >
                  <span
                    className={cx(
                      "absolute inset-y-0 left-0 w-0.5 transition-opacity",
                      ACCENT_BAR[review.accent],
                      index === active ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden="true"
                  />
                  <span className="block text-sm font-semibold text-cream-50">
                    {review.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-cream-200/55">
                    {review.role}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
