import type { GetServerSideProps } from "next";

import { getAllCategories, getAllProducts } from "@/lib/data";
import { SITE } from "@/lib/site";

/**
 * Dynamic sitemap.
 *
 * Generated on request (and edge-cached for an hour) so newly published
 * products appear without a rebuild. Nothing is rendered — the response is
 * written directly in getServerSideProps.
 */

type Entry = {
  path: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
};

const STATIC_ENTRIES: Entry[] = [
  { path: "/", changefreq: "daily", priority: 1.0 },
  { path: "/shop", changefreq: "daily", priority: 0.9 },
  { path: "/categories", changefreq: "weekly", priority: 0.8 },
  { path: "/bulk-orders", changefreq: "monthly", priority: 0.7 },
  { path: "/about", changefreq: "monthly", priority: 0.6 },
  { path: "/contact", changefreq: "monthly", priority: 0.6 },
  { path: "/delivery-and-returns", changefreq: "yearly", priority: 0.4 },
  { path: "/privacy-policy", changefreq: "yearly", priority: 0.3 },
  { path: "/terms", changefreq: "yearly", priority: 0.3 },
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlNode(entry: Entry, lastmod: string): string {
  return `  <url>
    <loc>${escapeXml(`${SITE.url}${entry.path}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  const lastmod = new Date().toISOString().split("T")[0];

  const entries: Entry[] = [
    ...STATIC_ENTRIES,
    ...categories.map((category) => ({
      path: `/categories/${category.slug}`,
      changefreq: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      path: `/products/${product.slug}`,
      changefreq: "weekly" as const,
      priority: 0.7,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((entry) => urlNode(entry, lastmod)).join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400",
  );
  res.write(xml);
  res.end();

  return { props: {} };
};

// Never rendered — getServerSideProps ends the response.
export default function Sitemap() {
  return null;
}
