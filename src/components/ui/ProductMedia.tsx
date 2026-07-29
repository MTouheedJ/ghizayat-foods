import Image from "next/image";

import { cx } from "@/lib/format";
import { sanityImageLoader } from "@/lib/sanity-image";
import type { CategoryAccent, ProductImage } from "@/lib/types";

/**
 * Renders a product photo, or a designed brand placeholder when none exists.
 *
 * The placeholder matters: with demo data there are no photos at all, and a
 * grid of grey boxes would read as broken. Instead each product gets a
 * deterministic gradient tile with a spice motif, so the storefront looks
 * finished from the first `npm run dev`.
 */

type Props = {
  image: ProductImage | null;
  alt: string;
  /** Seeds the placeholder motif + hue so each product looks distinct. */
  seed: string;
  accent?: CategoryAccent;
  /** Responsive sizes hint — always pass one to avoid over-fetching. */
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Urdu/local name, drawn faintly into the placeholder. */
  localTitle?: string | null;
};

const ACCENT_STYLES: Record<
  CategoryAccent,
  { wrap: string; blobA: string; blobB: string; glyph: string; text: string }
> = {
  crimson: {
    wrap: "from-chilli-100 via-cream-100 to-chilli-200",
    blobA: "bg-chilli-400/35",
    blobB: "bg-saffron-400/30",
    glyph: "text-chilli-700/15",
    text: "text-chilli-800/25",
  },
  royal: {
    wrap: "from-royal-100 via-cream-100 to-royal-200",
    blobA: "bg-royal-400/35",
    blobB: "bg-chilli-300/25",
    glyph: "text-royal-800/15",
    text: "text-royal-900/25",
  },
  saffron: {
    wrap: "from-saffron-100 via-cream-100 to-saffron-300/60",
    blobA: "bg-saffron-400/40",
    blobB: "bg-chilli-300/25",
    glyph: "text-saffron-600/20",
    text: "text-ink-700/20",
  },
  emerald: {
    wrap: "from-leaf-100 via-cream-100 to-leaf-100",
    blobA: "bg-leaf-500/30",
    blobB: "bg-royal-300/25",
    glyph: "text-leaf-700/15",
    text: "text-leaf-700/25",
  },
};

/** Four hand-drawn motifs: seeds, pod, leaf-spray, grain cluster. */
const MOTIFS = [
  // Scattered seeds
  "M20 62c6-10 14-14 24-12s16 10 26 8 14-10 24-8M18 44c8-8 16-9 26-5s18 6 27 1 13-11 21-9",
  // Cardamom pod
  "M60 18c14 8 22 24 22 42s-8 30-22 38c-14-8-22-20-22-38s8-34 22-42zM60 22v76",
  // Leaf spray
  "M60 96c0-30 12-52 34-64-4 26-14 44-34 64zM60 96C60 66 48 44 26 32c4 26 14 44 34 64zM60 96V52",
  // Grain cluster
  "M60 100V34M60 42c-10-6-16-14-16-24 10 2 16 8 16 16M60 42c10-6 16-14 16-24-10 2-16 8-16 16M60 62c-10-6-16-14-16-24 10 2 16 8 16 16M60 62c10-6 16-14 16-24-10 2-16 8-16 16",
];

function seedIndex(seed: string, buckets: number): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % buckets;
}

export default function ProductMedia({
  image,
  alt,
  seed,
  accent = "crimson",
  sizes,
  priority = false,
  className,
  localTitle,
}: Props) {
  if (image?.url) {
    const isSanity = image.url.includes("cdn.sanity.io");

    return (
      <Image
        src={image.url}
        alt={image.alt || alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        loader={isSanity ? sanityImageLoader : undefined}
        placeholder={image.lqip ? "blur" : "empty"}
        blurDataURL={image.lqip ?? undefined}
        className={cx("object-cover", className)}
      />
    );
  }

  const style = ACCENT_STYLES[accent];
  const motif = MOTIFS[seedIndex(seed, MOTIFS.length)];
  const tilt = seedIndex(`${seed}-tilt`, 5) * 7 - 14;

  return (
    <div
      role="img"
      aria-label={alt}
      className={cx(
        "absolute inset-0 overflow-hidden bg-gradient-to-br",
        style.wrap,
        className,
      )}
    >
      {/* Soft colour blooms give each tile depth without an image request. */}
      <div
        className={cx(
          "absolute -left-8 -top-10 h-32 w-32 rounded-full blur-2xl",
          style.blobA,
        )}
      />
      <div
        className={cx(
          "absolute -bottom-12 -right-6 h-36 w-36 rounded-full blur-2xl",
          style.blobB,
        )}
      />

      <svg
        viewBox="0 0 120 120"
        aria-hidden="true"
        className={cx(
          "absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-110",
          style.glyph,
        )}
        style={{ transform: `rotate(${tilt}deg) scale(0.78)` }}
      >
        <path
          d={motif}
          fill="none"
          stroke="currentColor"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {localTitle ? (
        <span
          aria-hidden="true"
          className={cx(
            "font-urdu absolute inset-x-0 bottom-3 truncate px-3 text-center text-lg font-medium",
            style.text,
          )}
        >
          {localTitle}
        </span>
      ) : null}

      <div className="bg-grain absolute inset-0 opacity-60" />
    </div>
  );
}
