import type { ReactNode } from "react";

/**
 * Minimal typographic wrapper for policy/legal copy.
 *
 * Hand-rolled rather than pulling in @tailwindcss/typography — we need four
 * element styles, not a 30KB plugin.
 */
export default function Prose({ children }: { children: ReactNode }) {
  return (
    <div
      className="
        max-w-3xl text-base leading-[1.85] text-ink-600
        [&_a]:font-medium [&_a]:text-chilli-600 [&_a]:underline hover:[&_a]:text-chilli-700
        [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink-900
        [&_h3]:mt-7 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-ink-900
        [&_li]:mt-1.5
        [&_p]:mt-4
        [&_strong]:font-semibold [&_strong]:text-ink-800
        [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5
      "
    >
      {children}
    </div>
  );
}
