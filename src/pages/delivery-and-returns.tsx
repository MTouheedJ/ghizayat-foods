import type { GetStaticProps } from "next";

import Seo, { breadcrumbSchema } from "@/components/Seo";
import PageHeader from "@/components/ui/PageHeader";
import Prose from "@/components/ui/Prose";
import { getAllCategories } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  REVALIDATE_SECONDS,
  SITE,
} from "@/lib/site";
import type { Category } from "@/lib/types";

export default function DeliveryPage() {
  return (
    <>
      <Seo
        title="Delivery & Returns"
        description={`Delivery charges, timelines and the returns policy for ${SITE.name}. Free delivery over ${formatPrice(FREE_DELIVERY_THRESHOLD)}, cash on delivery nationwide.`}
        canonicalPath="/delivery-and-returns"
        jsonLd={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Delivery & Returns", path: "/delivery-and-returns" },
          ]),
        ]}
      />

      <PageHeader
        title="Delivery & returns"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Delivery & Returns", path: "/delivery-and-returns" },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Prose>
          <h2>Delivery charges</h2>
          <p>
            Delivery is a flat <strong>{formatPrice(DELIVERY_FEE)}</strong>{" "}
            anywhere in Pakistan. Orders of{" "}
            <strong>{formatPrice(FREE_DELIVERY_THRESHOLD)} or more ship
            free</strong>. The charge is shown on the cart and checkout pages
            before you place the order — there are no fees added afterwards.
          </p>

          <h2>How long it takes</h2>
          <ul>
            <li>
              <strong>Lahore:</strong> next working day for orders confirmed
              before 4:00 PM.
            </li>
            <li>
              <strong>Karachi, Islamabad, Rawalpindi, Faisalabad, Multan:</strong>{" "}
              two to three working days.
            </li>
            <li>
              <strong>Elsewhere in Pakistan:</strong> three to five working
              days.
            </li>
            <li>
              <strong>Custom grinds and bulk orders:</strong> add two to three
              days for milling.
            </li>
          </ul>
          <p>
            We call every order to confirm the address before dispatch. If we
            cannot reach you on the number provided within 48 hours, the order
            is held rather than cancelled.
          </p>

          <h2>Paying for your order</h2>
          <p>
            <strong>Cash on delivery is our only payment method.</strong> You
            pay the rider in cash when the parcel reaches you. Nothing is
            charged in advance, and we never ask for card or bank details over
            the phone. Please keep the exact amount ready where possible, as
            riders do not always carry change for large notes.
          </p>

          <h2>Checking your order</h2>
          <p>
            You are welcome to open the parcel and check the contents and
            weights in front of the rider before paying. We would rather you
            checked at the door than discovered a problem later.
          </p>

          <h2>Returns and replacements</h2>
          <p>
            Food is perishable, so our policy is narrower than a clothing shop&rsquo;s
            — but it is unconditional within its scope. We will replace or
            refund, your choice, if:
          </p>
          <ul>
            <li>the item delivered is not the item you ordered;</li>
            <li>the weight is short of what is printed on the pack;</li>
            <li>the packaging arrived damaged, torn or leaking;</li>
            <li>
              the product is spoiled, infested or otherwise not fit to eat.
            </li>
          </ul>
          <p>
            Tell us within <strong>48 hours</strong> of delivery, with a photo
            where possible. We arrange collection at our cost and send a
            replacement on the next dispatch, or refund in full.
          </p>

          <h3>What we cannot take back</h3>
          <p>
            Opened packs returned simply because you changed your mind, and any
            item where more than half has been used. Ground spices in
            particular cannot be resold once a seal is broken. If a product is
            genuinely not as described, that is covered above and this
            paragraph does not apply.
          </p>

          <h2>Cancelling an order</h2>
          <p>
            Call or WhatsApp us any time before dispatch and we will cancel it
            with no charge. Once a parcel has left the shop it cannot be
            cancelled, but you may simply decline it at the door — since
            payment is on delivery, nothing is owed.
          </p>

          <h2>Questions</h2>
          <p>
            Call <a href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`}>{SITE.phone}</a>{" "}
            during {SITE.hours}, or email{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
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
