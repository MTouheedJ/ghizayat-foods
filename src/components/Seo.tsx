import Head from "next/head";
import { useRouter } from "next/router";

import { SITE } from "@/lib/site";

type Props = {
  title?: string;
  description?: string;
  /** Absolute or root-relative OG image. Defaults to the generated brand card. */
  image?: string;
  /** Overrides the canonical derived from the current route. */
  canonicalPath?: string;
  type?: "website" | "article" | "product";
  noIndex?: boolean;
  /** JSON-LD objects appended as <script type="application/ld+json">. */
  jsonLd?: Array<Record<string, unknown>>;
};

function absolute(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export default function Seo({
  title,
  description = SITE.description,
  image = "/og-default.svg",
  canonicalPath,
  type = "website",
  noIndex = false,
  jsonLd = [],
}: Props) {
  const router = useRouter();

  // asPath carries query strings and hashes; canonicals must not.
  const path = canonicalPath ?? router.asPath.split(/[?#]/)[0];
  const canonical = absolute(path === "/" ? "" : path);

  const fullTitle = title
    ? `${title} | ${SITE.name}`
    : `${SITE.name} — ${SITE.tagline}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} key="og:title" />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={SITE.locale} />
      <meta property="og:image" content={absolute(image)} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} key="twitter:title" />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absolute(image)} />

      {/* All schemas go in ONE script as a JSON array.
          next/head dedupes sibling <script> tags that share no `src`, so
          emitting one block per schema silently dropped all but the first. */}
      {jsonLd.length > 0 ? (
        <script
          key="ld-json"
          type="application/ld+json"
          // `<` is escaped so a "</script>" inside any string can't break out.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              jsonLd.length === 1 ? jsonLd[0] : jsonLd,
            ).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}
    </Head>
  );
}

/* ── Schema.org builders ───────────────────────────────────────────────────*/

export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    sameAs: [SITE.social.facebook, SITE.social.instagram, SITE.social.youtube],
  };
}

export function localBusinessSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    "@id": `${SITE.url}/#store`,
    name: SITE.name,
    image: `${SITE.url}/og-default.svg`,
    url: SITE.url,
    telephone: SITE.phone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "21:00",
    },
  };
}

export function breadcrumbSchema(
  crumbs: Array<{ name: string; path: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.path),
    })),
  };
}

export function websiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    publisher: { "@id": `${SITE.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
