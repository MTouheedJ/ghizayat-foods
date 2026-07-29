import type { NextApiRequest, NextApiResponse } from "next";

/**
 * On-demand revalidation webhook for Sanity.
 *
 * Point a Sanity webhook at:
 *   https://your-domain.com/api/revalidate?secret=SANITY_REVALIDATE_SECRET
 *
 * When your team hits "Publish" in the Studio, the affected pages regenerate
 * within seconds instead of waiting for the 5-minute ISR window.
 */

type Body = {
  _type?: string;
  slug?: { current?: string } | string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ revalidated: boolean; paths?: string[]; message?: string }>,
) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return res.status(500).json({
      revalidated: false,
      message: "SANITY_REVALIDATE_SECRET is not configured.",
    });
  }

  const provided =
    (typeof req.query.secret === "string" ? req.query.secret : "") ||
    (req.headers["x-webhook-secret"] as string | undefined) ||
    "";

  if (provided !== secret) {
    return res.status(401).json({ revalidated: false, message: "Invalid secret." });
  }

  const body = (req.body ?? {}) as Body;
  const slug =
    typeof body.slug === "string" ? body.slug : (body.slug?.current ?? "");

  // Always refresh the pages that aggregate the whole catalogue.
  const paths = new Set<string>(["/", "/shop", "/categories", "/sitemap.xml"]);

  if (slug) {
    if (body._type === "product") paths.add(`/products/${slug}`);
    if (body._type === "category") paths.add(`/categories/${slug}`);
  }

  const revalidated: string[] = [];

  for (const path of paths) {
    try {
      await res.revalidate(path);
      revalidated.push(path);
    } catch (error) {
      // A path that was never generated can't be revalidated — not fatal.
      console.warn(`[revalidate] skipped ${path}:`, error);
    }
  }

  return res.status(200).json({ revalidated: true, paths: revalidated });
}
