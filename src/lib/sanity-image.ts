import type { ImageLoaderProps } from "next/image";
import type { ProductImage } from "./types";

/**
 * Custom next/image loader pointing at Sanity's image CDN.
 *
 * Passed per-<Image> (never globally) so local /public assets keep using the
 * default optimizer. Transformations resolve on Sanity's CDN, which means they
 * do not count against the host's image-optimization quota — the difference
 * between "free forever" and "blocked in week two" on a large catalogue.
 */
export function sanityImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  if (!src.startsWith("http")) return src;

  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 78));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}

/** True when this image should be routed through the Sanity loader. */
export function isSanityImage(image: ProductImage | null): boolean {
  return Boolean(image?.url?.includes("cdn.sanity.io"));
}

/** Raw shape returned by our GROQ image projection. */
export type RawSanityImage = {
  url?: string | null;
  lqip?: string | null;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
};

/** Normalise a GROQ image projection into the UI's ProductImage shape. */
export function toProductImage(
  raw: RawSanityImage | null | undefined,
  fallbackAlt: string,
): ProductImage | null {
  if (!raw?.url) return null;
  return {
    url: raw.url,
    lqip: raw.lqip ?? null,
    alt: raw.alt?.trim() || fallbackAlt,
    width: raw.width ?? null,
    height: raw.height ?? null,
  };
}

export function toProductImages(
  raw: (RawSanityImage | null)[] | null | undefined,
  fallbackAlt: string,
): ProductImage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => toProductImage(item, fallbackAlt))
    .filter((item): item is ProductImage => item !== null);
}
