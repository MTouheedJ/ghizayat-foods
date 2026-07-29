import type { GetServerSideProps } from "next";

import { SITE } from "@/lib/site";

/**
 * Generated so the sitemap URL always matches NEXT_PUBLIC_SITE_URL — a static
 * public/robots.txt would silently point at the wrong domain after deploy.
 */
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Keep staging and preview deployments out of the index entirely.
  const isProduction =
    SITE.url.startsWith("https://") && !SITE.url.includes("localhost");

  const body = isProduction
    ? `User-agent: *
Allow: /

# Nothing useful to crawl, and /checkout carries order state.
Disallow: /api/
Disallow: /cart
Disallow: /checkout

Sitemap: ${SITE.url}/sitemap.xml
`
    : `User-agent: *
Disallow: /
`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400");
  res.write(body);
  res.end();

  return { props: {} };
};

export default function Robots() {
  return null;
}
