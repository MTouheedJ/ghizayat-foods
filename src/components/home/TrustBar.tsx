import Reveal, { RevealItem } from "@/components/ui/Reveal";

const PILLARS = [
  {
    title: "Cash on Delivery",
    body: "Pay the rider. No cards, no advance, no account needed.",
    path: "M3 7h18v10H3zM3 11h18M7 15h3",
  },
  {
    title: "Ground in small batches",
    body: "Milled weekly, not warehoused for months in a sack.",
    path: "M12 3v4M12 17v4M5 12H1m22 0h-4M6.3 6.3 3.5 3.5m17 17-2.8-2.8m0-11.4 2.8-2.8M3.5 20.5l2.8-2.8M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  },
  {
    title: "Weighed honestly",
    body: "Digital scales, sealed packs, printed weight on every bag.",
    path: "M12 3v18M5 7l-3 7h6zM19 7l-3 7h6zM7 21h10M6 7h12",
  },
  {
    title: "Nationwide delivery",
    body: "Lahore next day. Rest of Pakistan in two to four days.",
    path: "M1 8h11v8H1zM12 11h4l3 3v2h-7zM6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  },
];

export default function TrustBar() {
  return (
    <section className="border-y border-cream-200 bg-white/60">
      <Reveal
        as="ul"
        stagger={0.08}
        className="mx-auto grid max-w-7xl gap-px overflow-hidden px-4 py-2 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8"
      >
        {PILLARS.map((pillar) => (
          <RevealItem
            as="li"
            key={pillar.title}
            className="flex items-start gap-3.5 px-2 py-5 md:px-5"
          >
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-chilli-50 text-chilli-600">
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
                <path d={pillar.path} />
              </svg>
            </span>
            <div>
              <h3 className="font-display text-[0.98rem] font-semibold text-ink-800">
                {pillar.title}
              </h3>
              <p className="mt-1 text-[0.83rem] leading-relaxed text-ink-500">
                {pillar.body}
              </p>
            </div>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}
