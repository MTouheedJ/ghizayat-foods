import { cx } from "@/lib/format";
import { SITE } from "@/lib/site";

/**
 * Brand mark: a star-anise silhouette split between chilli red and royal blue,
 * drawn as inline SVG so it costs no request and stays crisp at every size.
 */
export default function Logo({
  className,
  showWordmark = true,
  invert = false,
}: {
  className?: string;
  showWordmark?: boolean;
  invert?: boolean;
}) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        className="h-9 w-9 shrink-0 transition-transform duration-500 group-hover:rotate-45"
      >
        <defs>
          <linearGradient id="gf-mark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e63149" />
            <stop offset="52%" stopColor="#c81e3c" />
            <stop offset="100%" stopColor="#1d35d8" />
          </linearGradient>
        </defs>

        <circle cx="24" cy="24" r="23" fill="url(#gf-mark)" />

        {/* Eight-point star anise */}
        <g
          fill="none"
          stroke="#fefaf6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <path
              key={angle}
              d="M24 24 L24 9"
              transform={`rotate(${angle} 24 24)`}
            />
          ))}
          <circle cx="24" cy="24" r="6.5" fill="#fefaf6" stroke="none" />
          <circle cx="24" cy="24" r="2.6" fill="#c81e3c" stroke="none" />
        </g>
      </svg>

      {showWordmark ? (
        <span className="flex flex-col leading-none">
          <span
            className={cx(
              "font-display text-[1.35rem] font-bold tracking-tight",
              invert ? "text-cream-50" : "text-ink-900",
            )}
          >
            Ghizayat
          </span>
          <span
            className={cx(
              "text-[0.62rem] font-semibold uppercase tracking-[0.28em]",
              invert ? "text-cream-200/70" : "text-chilli-600",
            )}
          >
            Foods
          </span>
        </span>
      ) : (
        <span className="sr-only">{SITE.name}</span>
      )}
    </span>
  );
}
