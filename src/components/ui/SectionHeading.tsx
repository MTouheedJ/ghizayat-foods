import Link from "next/link";

import Reveal from "@/components/ui/Reveal";
import { cx } from "@/lib/format";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
  align = "left",
  invert = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
  invert?: boolean;
}) {
  return (
    <Reveal
      className={cx(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
      )}
    >
      <div className={cx("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p
            className={cx(
              "text-xs font-bold uppercase tracking-[0.2em]",
              invert ? "text-chilli-300" : "text-chilli-600",
            )}
          >
            {eyebrow}
          </p>
        ) : null}

        <h2
          className={cx(
            "mt-2.5 font-display text-3xl font-bold leading-tight sm:text-[2.6rem]",
            invert ? "text-cream-50" : "text-ink-900",
          )}
        >
          {title}
        </h2>

        {description ? (
          <p
            className={cx(
              "mt-3.5 text-base leading-relaxed",
              invert ? "text-cream-200/75" : "text-ink-500",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>

      {href ? (
        <Link
          href={href}
          className={cx(
            "group inline-flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition",
            invert
              ? "border-cream-50/20 text-cream-100 hover:border-cream-50/50 hover:bg-white/10"
              : "border-ink-900/15 text-ink-800 hover:border-chilli-500 hover:bg-chilli-50 hover:text-chilli-700",
          )}
        >
          {linkLabel}
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </Link>
      ) : null}
    </Reveal>
  );
}
