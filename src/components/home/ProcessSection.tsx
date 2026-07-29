import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import Reveal, { RevealItem } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

const STEPS = [
  {
    number: "01",
    title: "Bought at the source",
    body: "Our buyers sit at the mandis in Kunri, Quetta and Gilgit through the season. No middlemen, no repackaged imports sold as local.",
    tone: "from-chilli-500 to-chilli-700",
  },
  {
    number: "02",
    title: "Cleaned and graded",
    body: "Every lot is de-stoned, sieved and colour-sorted before it is approved. Whatever fails the grade never reaches a bag.",
    tone: "from-saffron-400 to-saffron-600",
  },
  {
    number: "03",
    title: "Milled in small batches",
    body: "Spices are ground weekly on slow stone mills. Low speed means low heat, and low heat is what keeps the essential oils in.",
    tone: "from-royal-500 to-royal-800",
  },
  {
    number: "04",
    title: "Sealed and sent",
    body: "Vacuum-sealed the day it ships, weighed on calibrated scales, and paid for only when it reaches your door.",
    tone: "from-leaf-500 to-leaf-700",
  },
];

export default function ProcessSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Progress rail fills as the section moves through the viewport.
  const railScale = useTransform(scrollYProgress, [0.1, 0.75], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it reaches you"
          title="From the mandi to your masala dani"
          description="Four steps, and we control every one of them. That is the whole reason the flavour survives the journey."
        />

        <div className="relative mt-14">
          {/* Rail — decorative, desktop only */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-7 hidden h-0.5 bg-cream-200 lg:block"
          >
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-chilli-500 via-saffron-500 to-royal-700"
              style={{ scaleX: reduceMotion ? 1 : railScale }}
            />
          </div>

          <Reveal
            as="ul"
            stagger={0.1}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          >
            {STEPS.map((step) => (
              <RevealItem as="li" key={step.number} className="relative">
                <div
                  className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.tone} font-display text-lg font-bold text-white shadow-lg`}
                >
                  {step.number}
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink-900">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-500">
                  {step.body}
                </p>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
