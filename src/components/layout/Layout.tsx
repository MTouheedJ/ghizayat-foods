import type { ReactNode } from "react";

import Footer from "./Footer";
import Header from "./Header";
import { SITE } from "@/lib/site";
import type { Category } from "@/lib/types";

export default function Layout({
  children,
  categories = [],
}: {
  children: ReactNode;
  categories?: Category[];
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-chilli-600 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <Header categories={categories} />

      <main id="main" className="flex-1">
        {children}
      </main>

      <Footer categories={categories} />

      {/* Floating WhatsApp — the default ordering channel for most customers. */}
      <a
        href={`https://wa.me/${SITE.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group fixed bottom-5 right-5 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-leaf-600 text-white shadow-lg transition hover:scale-105 hover:bg-leaf-700 active:scale-95"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-leaf-500 animate-[pulse-ring_2.6s_cubic-bezier(0.4,0,0.6,1)_infinite]"
        />
        <svg
          viewBox="0 0 24 24"
          className="relative h-6.5 w-6.5"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.5-.6a11 11 0 0 1-4.3-4.4c-.3-.6-.5-1.1-.5-1.6 0-.5.2-1 .5-1.3.2-.2.4-.3.6-.3h.5c.2 0 .4 0 .5.4l.7 1.7c0 .2 0 .3-.1.4l-.3.4-.2.2c-.1.1-.2.3 0 .5a8 8 0 0 0 3.5 3c.3.1.4.1.6-.1l.7-.8c.2-.2.3-.2.5-.1l1.7.8c.2.1.3.2.4.3v.7Z" />
        </svg>
      </a>
    </div>
  );
}
