import "@/styles/globals.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";

import Layout from "@/components/layout/Layout";
import { CartProvider } from "@/lib/cart";
import type { Category } from "@/lib/types";

/**
 * Both faces are variable fonts, self-hosted and subset by next/font at build
 * time — no third-party request, no FOIT, and no layout shift because the
 * fallback metrics are matched automatically.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

type PageProps = { categories?: Category[] };

export default function App({ Component, pageProps }: AppProps<PageProps>) {
  return (
    <>
      <Head>
        {/* Belongs here rather than _document — Next.js requires the viewport
            tag in a page/_app Head so it can be deduped correctly. */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#c81e3c" />
      </Head>

      <div className={`${jakarta.variable} ${playfair.variable}`}>
        <CartProvider>
          <Layout categories={pageProps.categories ?? []}>
            <Component {...pageProps} />
          </Layout>
        </CartProvider>
      </div>
    </>
  );
}
