import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    // Next 16 no longer overrides `scroll-behavior: smooth` during SPA
    // navigation unless this attribute is present — without it, route changes
    // would smooth-scroll to the top instead of jumping.
    <Html lang="en" data-scroll-behavior="smooth">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Warm up the image CDN before the first product card paints. */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
