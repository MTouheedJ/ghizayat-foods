import type { GetStaticProps } from "next";
import Link from "next/link";

import Seo, { breadcrumbSchema } from "@/components/Seo";
import PageHeader from "@/components/ui/PageHeader";
import Prose from "@/components/ui/Prose";
import { getAllCategories } from "@/lib/data";
import { REVALIDATE_SECONDS, SITE } from "@/lib/site";
import type { Category } from "@/lib/types";

export default function TermsPage() {
  return (
    <>
      <Seo
        title="Terms of Service"
        description={`The terms on which ${SITE.name} sells and delivers products ordered through this website.`}
        canonicalPath="/terms"
        jsonLd={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Terms of Service", path: "/terms" },
          ]),
        ]}
      />

      <PageHeader
        title="Terms of service"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Terms of Service", path: "/terms" },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Prose>
          <p>
            These terms apply to orders placed through this website with{" "}
            {SITE.name}, {SITE.address.city}, Pakistan.
          </p>

          <h2>Placing an order</h2>
          <p>
            Submitting the checkout form is an offer to buy, not a concluded
            sale. The contract forms when we confirm your order by phone or
            WhatsApp. We may decline an order — for example if an item has just
            sold out, if the delivery address is outside our courier&rsquo;s
            reach, or if we cannot verify the contact number.
          </p>

          <h2>Prices and weights</h2>
          <p>
            Prices are in Pakistani Rupees and include applicable taxes. Because
            we deal in agricultural commodities, prices move with the market and
            may change without notice; the price confirmed on your order is the
            price you pay.
          </p>
          <p>
            Weights are net at the time of packing. Natural products can lose a
            small amount of moisture in transit — a variance of up to 2% on dry
            goods is normal and is not a short weight. Anything beyond that is
            covered by our{" "}
            <Link href="/delivery-and-returns">returns policy</Link>.
          </p>

          <h2>Payment</h2>
          <p>
            <strong>Cash on delivery is the only accepted method.</strong>{" "}
            Payment is due in full, in cash, to the rider at the time of
            delivery. We do not accept cards, cheques or online transfers for
            retail orders, and we will never ask for payment before delivery.
          </p>

          <h2>Delivery</h2>
          <p>
            Delivery timelines given on the site are estimates in working days
            and are not guaranteed. We are not liable for delays caused by
            weather, strikes, road closures or other events outside our control,
            though we will keep you informed and you may cancel an undelivered
            order at any time at no cost.
          </p>

          <h2>Product information</h2>
          <p>
            We describe origin, grade and character as accurately as we can.
            Natural variation in colour, size and intensity between harvests is
            inherent to the goods and is not a defect. Product images and
            placeholder graphics are illustrative.
          </p>

          <h2>Allergens and suitability</h2>
          <p>
            Our products are handled in a facility that also processes nuts,
            sesame and mustard. If you have a severe allergy, please contact us
            before ordering. Nothing on this site is medical advice; traditional
            uses described for herbs are cultural context, not health claims.
          </p>

          <h2>Bulk and wholesale</h2>
          <p>
            Bulk supply runs on separate commercial terms agreed in writing,
            which take precedence over these terms where they conflict.
          </p>

          <h2>Liability</h2>
          <p>
            Our liability in respect of any order is limited to the value of
            that order. Nothing in these terms limits liability that cannot be
            limited under Pakistani law.
          </p>

          <h2>Using this website</h2>
          <p>
            Site content, text and branding belong to {SITE.name}. Please do not
            scrape, republish or resell it. Do not attempt to disrupt the site
            or submit false orders.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws of the Islamic Republic of
            Pakistan, and the courts of {SITE.address.city} have jurisdiction.
          </p>

          <h2>Contact</h2>
          <p>
            <a href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`}>{SITE.phone}</a>{" "}
            · <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
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
