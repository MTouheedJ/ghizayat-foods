import type { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type FormEvent } from "react";

import Seo from "@/components/Seo";
import { useCart } from "@/lib/cart";
import { getAllCategories } from "@/lib/data";
import { cx, formatPrice } from "@/lib/format";
import { REVALIDATE_SECONDS, SITE } from "@/lib/site";
import type { Category, OrderCustomer } from "@/lib/types";
import type { OrderResponse } from "./api/orders";

const CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Bahawalpur",
];

const EMPTY: OrderCustomer = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  notes: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { lines, isReady, subtotal, deliveryFee, total, clear } = useCart();

  const [customer, setCustomer] = useState<OrderCustomer>(EMPTY);
  const [company, setCompany] = useState(""); // honeypot
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<{
    orderNumber: string;
    total: number;
  } | null>(null);

  // Send people back to the cart if they land here with nothing in it.
  useEffect(() => {
    if (isReady && lines.length === 0 && !confirmed) {
      router.replace("/cart");
    }
  }, [isReady, lines.length, confirmed, router]);

  function update(field: keyof OrderCustomer, value: string) {
    setCustomer((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setFormError("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, lines, company }),
      });

      const data: OrderResponse = await response.json();

      if (!data.ok) {
        setFormError(data.error);
        if (data.fields) setFieldErrors(data.fields);
        // Bring the first problem into view on mobile.
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      setConfirmed({ orderNumber: data.orderNumber, total: data.total });
      clear();
    } catch {
      setFormError(
        "We couldn't reach the server. Check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Confirmation ─────────────────────────────────────────────────────── */
  if (confirmed) {
    return (
      <>
        <Seo title="Order Confirmed" noIndex />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <motion.div
            initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-leaf-100"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-10 w-10 text-leaf-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m5 13 4 4L19 7" />
            </svg>
          </motion.div>

          <h1 className="mt-7 font-display text-3xl font-bold text-ink-900 sm:text-4xl">
            Order confirmed
          </h1>
          <p className="mt-3 text-ink-500">
            Shukriya. We have your order and will call to confirm the delivery
            time within a few hours.
          </p>

          <div className="mt-8 rounded-2xl border border-cream-200 bg-white p-6 text-left">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-500">Order number</dt>
                <dd className="font-mono font-bold text-ink-900">
                  {confirmed.orderNumber}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Amount payable</dt>
                <dd className="font-display text-lg font-bold text-chilli-700">
                  {formatPrice(confirmed.total)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Payment</dt>
                <dd className="font-semibold text-ink-800">
                  Cash on Delivery
                </dd>
              </div>
            </dl>
            <p className="mt-5 border-t border-cream-200 pt-4 text-xs leading-relaxed text-ink-400">
              Please keep {formatPrice(confirmed.total)} in cash ready for the
              rider. Questions? Call{" "}
              <a
                href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`}
                className="font-semibold text-chilli-600"
              >
                {SITE.phone}
              </a>
              .
            </p>
          </div>

          <Link
            href="/shop"
            className="mt-8 inline-block rounded-full bg-chilli-600 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-chilli-700"
          >
            Continue shopping
          </Link>
        </div>
      </>
    );
  }

  /* ── Form ─────────────────────────────────────────────────────────────── */
  return (
    <>
      <Seo
        title="Checkout"
        description="Complete your Ghizayat Foods order. Cash on delivery across Pakistan."
        noIndex
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-xs text-ink-400">
          <Link href="/cart" className="transition hover:text-chilli-600">
            Cart
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-ink-600">Checkout</span>
        </nav>

        <h1 className="mt-3 font-display text-3xl font-bold text-ink-900 sm:text-5xl">
          Checkout
        </h1>

        {formError ? (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-chilli-300 bg-chilli-50 px-4 py-3 text-sm font-medium text-chilli-800"
          >
            {formError}
          </div>
        ) : null}

        <form
          onSubmit={onSubmit}
          noValidate
          className="mt-8 lg:grid lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-10"
        >
          <div className="space-y-8">
            {/* Delivery details */}
            <fieldset className="rounded-2xl border border-cream-200 bg-white p-6">
              <legend className="px-2 font-display text-lg font-bold text-ink-900">
                Delivery details
              </legend>

              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <Field
                  id="name"
                  label="Full name"
                  required
                  value={customer.name}
                  error={fieldErrors.name}
                  autoComplete="name"
                  onChange={(value) => update("name", value)}
                />
                <Field
                  id="phone"
                  label="Mobile number"
                  required
                  type="tel"
                  placeholder="0300 1234567"
                  value={customer.phone}
                  error={fieldErrors.phone}
                  autoComplete="tel"
                  hint="We call this number to confirm your order."
                  onChange={(value) => update("phone", value)}
                />
                <Field
                  id="email"
                  label="Email (optional)"
                  type="email"
                  value={customer.email}
                  error={fieldErrors.email}
                  autoComplete="email"
                  onChange={(value) => update("email", value)}
                />

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-semibold text-ink-700"
                  >
                    City <span className="text-chilli-600">*</span>
                  </label>
                  <input
                    id="city"
                    list="pk-cities"
                    value={customer.city}
                    onChange={(event) => update("city", event.target.value)}
                    autoComplete="address-level2"
                    aria-invalid={Boolean(fieldErrors.city)}
                    className={cx(
                      "mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm transition focus:outline-none focus:ring-4",
                      fieldErrors.city
                        ? "border-chilli-500 focus:ring-chilli-500/15"
                        : "border-cream-300 focus:border-chilli-400 focus:ring-chilli-500/10",
                    )}
                  />
                  <datalist id="pk-cities">
                    {CITIES.map((city) => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                  {fieldErrors.city ? (
                    <p className="mt-1.5 text-xs font-medium text-chilli-700">
                      {fieldErrors.city}
                    </p>
                  ) : null}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-semibold text-ink-700"
                  >
                    Complete address <span className="text-chilli-600">*</span>
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    value={customer.address}
                    onChange={(event) => update("address", event.target.value)}
                    autoComplete="street-address"
                    placeholder="House / flat number, street, area, nearest landmark"
                    aria-invalid={Boolean(fieldErrors.address)}
                    className={cx(
                      "mt-2 w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm transition focus:outline-none focus:ring-4",
                      fieldErrors.address
                        ? "border-chilli-500 focus:ring-chilli-500/15"
                        : "border-cream-300 focus:border-chilli-400 focus:ring-chilli-500/10",
                    )}
                  />
                  {fieldErrors.address ? (
                    <p className="mt-1.5 text-xs font-medium text-chilli-700">
                      {fieldErrors.address}
                    </p>
                  ) : null}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-semibold text-ink-700"
                  >
                    Order notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    value={customer.notes}
                    onChange={(event) => update("notes", event.target.value)}
                    placeholder="Grind the garam masala coarse, deliver after 5pm…"
                    className="mt-2 w-full resize-y rounded-xl border border-cream-300 bg-white px-4 py-3 text-sm transition focus:border-chilli-400 focus:outline-none focus:ring-4 focus:ring-chilli-500/10"
                  />
                </div>
              </div>

              {/* Honeypot — visually hidden, never focusable */}
              <div aria-hidden="true" className="hidden">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                />
              </div>
            </fieldset>

            {/* Payment */}
            <fieldset className="rounded-2xl border border-cream-200 bg-white p-6">
              <legend className="px-2 font-display text-lg font-bold text-ink-900">
                Payment method
              </legend>

              <div className="mt-4 flex items-start gap-4 rounded-xl border-2 border-chilli-500 bg-chilli-50/60 p-4">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[6px] border-chilli-600 bg-white" />
                <div>
                  <p className="font-semibold text-ink-900">
                    Cash on Delivery
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-500">
                    Pay the rider in cash when your order reaches you. No card,
                    no bank transfer, no advance payment — and nothing is
                    charged until the parcel is in your hands.
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs text-ink-400">
                Cash on delivery is currently the only payment method we accept.
              </p>
            </fieldset>
          </div>

          {/* Summary */}
          <aside className="mt-8 lg:sticky lg:top-40 lg:mt-0">
            <div className="rounded-2xl border border-cream-200 bg-white p-6">
              <h2 className="font-display text-xl font-bold text-ink-900">
                Your order
              </h2>

              <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
                {lines.map((line) => (
                  <li
                    key={line.variantId}
                    className="flex justify-between gap-3 text-sm"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-ink-800">
                        {line.productTitle}
                      </span>
                      <span className="text-xs text-ink-400">
                        {line.variantLabel} × {line.quantity}
                      </span>
                    </span>
                    <span className="shrink-0 font-semibold text-ink-800">
                      {formatPrice(line.price * line.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-5 space-y-3 border-t border-cream-200 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-500">Subtotal</dt>
                  <dd className="font-semibold">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-500">Delivery</dt>
                  <dd className="font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-leaf-600">Free</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-cream-200 pt-3">
                  <dt className="font-display text-base font-bold text-ink-900">
                    Pay on delivery
                  </dt>
                  <dd className="font-display text-xl font-bold text-chilli-700">
                    {formatPrice(total)}
                  </dd>
                </div>
              </dl>

              <button
                type="submit"
                disabled={submitting || lines.length === 0}
                className={cx(
                  "mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition",
                  submitting || lines.length === 0
                    ? "cursor-not-allowed bg-cream-200 text-ink-400"
                    : "bg-chilli-600 text-white hover:bg-chilli-700 active:scale-[0.98]",
                )}
              >
                {submitting ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    />
                    Placing order…
                  </>
                ) : (
                  "Place order"
                )}
              </button>

              <p className="mt-3 text-center text-xs text-ink-400">
                By placing this order you agree to our{" "}
                <Link href="/terms" className="underline hover:text-chilli-600">
                  terms
                </Link>
                .
              </p>
            </div>
          </aside>
        </form>
      </div>
    </>
  );
}

/* ── Small field primitive ─────────────────────────────────────────────────*/

function Field({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  type = "text",
  required = false,
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink-700">
        {label} {required ? <span className="text-chilli-600">*</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={cx(
          "mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm transition focus:outline-none focus:ring-4",
          error
            ? "border-chilli-500 focus:ring-chilli-500/15"
            : "border-cream-300 focus:border-chilli-400 focus:ring-chilli-500/10",
        )}
      />
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-chilli-700">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export const getStaticProps: GetStaticProps<{
  categories: Category[];
}> = async () => ({
  props: { categories: await getAllCategories() },
  revalidate: REVALIDATE_SECONDS,
});
