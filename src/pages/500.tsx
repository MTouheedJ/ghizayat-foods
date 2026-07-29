import Link from "next/link";

import Seo from "@/components/Seo";
import { SITE } from "@/lib/site";

// Static by design: a 500 page must render even when data fetching is the
// thing that's broken, so it takes no getStaticProps.
export default function ServerErrorPage() {
  return (
    <>
      <Seo title="Something Went Wrong" noIndex />

      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 sm:py-32">
        <p className="font-display text-[6rem] font-bold leading-none text-gradient-brand sm:text-[9rem]">
          500
        </p>

        <h1 className="mt-4 font-display text-3xl font-bold text-ink-900 sm:text-4xl">
          Something boiled over
        </h1>
        <p className="mx-auto mt-3 max-w-md text-ink-500">
          An error on our side stopped this page loading. It has been logged and
          we are on it. Try again in a moment.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-chilli-600 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-chilli-700"
          >
            Back home
          </Link>
          <a
            href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`}
            className="rounded-full border border-cream-300 bg-white px-7 py-3.5 text-sm font-semibold text-ink-700 transition hover:border-chilli-400 hover:text-chilli-700"
          >
            Call to order · {SITE.phone}
          </a>
        </div>
      </div>
    </>
  );
}
