import type { GetStaticProps } from "next";

import Seo, { breadcrumbSchema } from "@/components/Seo";
import PageHeader from "@/components/ui/PageHeader";
import Prose from "@/components/ui/Prose";
import { getAllCategories } from "@/lib/data";
import { REVALIDATE_SECONDS, SITE } from "@/lib/site";
import type { Category } from "@/lib/types";

export default function PrivacyPage() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        description={`How ${SITE.name} collects, uses and protects your personal information.`}
        canonicalPath="/privacy-policy"
        jsonLd={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Privacy Policy", path: "/privacy-policy" },
          ]),
        ]}
      />

      <PageHeader
        title="Privacy policy"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy" },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Prose>
          <p>
            This policy explains what we collect, why, and what we do with it.
            It is deliberately short, because we deliberately collect very
            little.
          </p>

          <h2>What we collect</h2>
          <p>When you place an order we ask for:</p>
          <ul>
            <li>your name;</li>
            <li>a mobile number, so we can confirm the delivery;</li>
            <li>a delivery address and city;</li>
            <li>an email address — optional, and only used for receipts;</li>
            <li>any order notes you choose to add.</li>
          </ul>
          <p>
            That is all. Because we only accept cash on delivery,{" "}
            <strong>
              we never collect card numbers, CVVs or bank details
            </strong>
            . If anyone contacts you claiming to be us and asks for those, it is
            not us — please report it.
          </p>

          <h2>What we do with it</h2>
          <p>
            We use your details to pack, confirm and deliver your order, and to
            resolve any problem with it afterwards. We keep a record of past
            orders so that repeat customers do not have to explain their history
            each time they call.
          </p>
          <p>
            We do not sell, rent or trade your information. We share it only
            with the courier carrying your parcel, and only the fields they need
            to deliver it.
          </p>

          <h2>Your cart</h2>
          <p>
            The items in your basket are stored in your own browser&rsquo;s local
            storage, not on our servers. Clearing your browser data empties the
            cart. We do not use this to track you across other websites.
          </p>

          <h2>Cookies and analytics</h2>
          <p>
            The site sets no advertising cookies and runs no third-party
            advertising trackers. If we add analytics in future to understand
            which products people look for, it will be limited to aggregate,
            non-identifying usage data, and this page will be updated first.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Order records are retained for as long as needed for accounting and
            tax purposes. Enquiry messages are kept until resolved and then
            periodically cleared.
          </p>

          <h2>Your choices</h2>
          <p>
            You can ask us what we hold about you, ask us to correct it, or ask
            us to delete it — other than records we are required to keep for
            tax. Write to{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or call{" "}
            <a href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`}>
              {SITE.phone}
            </a>
            .
          </p>

          <h2>Security</h2>
          <p>
            The site is served over HTTPS and order data is stored with access
            limited to staff who need it. No system is perfect, but we do not
            hold payment credentials, which removes the most valuable target.
          </p>

          <h2>Changes</h2>
          <p>
            If this policy changes materially, the updated version will be
            posted here.
          </p>
        </Prose>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<{
  categories: Category[];
}> = async () => ({
  props: { categories: await getAllCategories() },
  revalidate: REVALIDATE_SECONDS,
});
