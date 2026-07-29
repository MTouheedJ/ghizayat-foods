import { motion, useReducedMotion } from "motion/react";
import { useState, type FormEvent } from "react";

import { cx } from "@/lib/format";
import type { EnquiryResponse } from "@/pages/api/enquiries";

type Kind = "contact" | "bulk";

type FormState = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  businessName: string;
  monthlyVolume: string;
};

const EMPTY: FormState = {
  name: "",
  phone: "",
  email: "",
  subject: "",
  message: "",
  businessName: "",
  monthlyVolume: "",
};

export default function EnquiryForm({ kind }: { kind: Kind }) {
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function update(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
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
    setErrors({});

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, kind, company }),
      });
      const data: EnquiryResponse = await response.json();

      if (!data.ok) {
        setFormError(data.error);
        if (data.fields) setErrors(data.fields);
        return;
      }

      setSent(true);
      setForm(EMPTY);
    } catch {
      setFormError("We couldn't send that. Check your connection and retry.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-leaf-500/30 bg-leaf-100/50 p-8 text-center"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-leaf-600 text-white">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m5 13 4 4L19 7" />
          </svg>
        </span>
        <h3 className="mt-5 font-display text-2xl font-bold text-ink-900">
          Message received
        </h3>
        <p className="mt-2 text-sm text-ink-600">
          {kind === "bulk"
            ? "Our wholesale desk will call you within one working day with a rate sheet."
            : "We usually reply the same day, during shop hours."}
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 text-sm font-semibold text-chilli-600 underline transition hover:text-chilli-700"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-cream-200 bg-white p-6 sm:p-8"
    >
      {formError ? (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-chilli-300 bg-chilli-50 px-4 py-3 text-sm font-medium text-chilli-800"
        >
          {formError}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="eq-name"
          label="Your name"
          required
          value={form.name}
          error={errors.name}
          autoComplete="name"
          onChange={(value) => update("name", value)}
        />
        <Input
          id="eq-phone"
          label="Phone"
          type="tel"
          required
          placeholder="0300 1234567"
          value={form.phone}
          error={errors.phone}
          autoComplete="tel"
          onChange={(value) => update("phone", value)}
        />
        <Input
          id="eq-email"
          label="Email (optional)"
          type="email"
          value={form.email}
          error={errors.email}
          autoComplete="email"
          onChange={(value) => update("email", value)}
        />

        {kind === "bulk" ? (
          <>
            <Input
              id="eq-business"
              label="Business name"
              value={form.businessName}
              autoComplete="organization"
              onChange={(value) => update("businessName", value)}
            />
            <div className="sm:col-span-2">
              <label
                htmlFor="eq-volume"
                className="block text-sm font-semibold text-ink-700"
              >
                Rough monthly volume
              </label>
              <select
                id="eq-volume"
                value={form.monthlyVolume}
                onChange={(event) => update("monthlyVolume", event.target.value)}
                className="mt-2 w-full rounded-xl border border-cream-300 bg-white px-4 py-3 text-sm focus:border-chilli-400 focus:outline-none focus:ring-4 focus:ring-chilli-500/10"
              >
                <option value="">Select a range</option>
                <option>Under 25 kg</option>
                <option>25 – 100 kg</option>
                <option>100 – 500 kg</option>
                <option>500 kg – 2 tonnes</option>
                <option>Over 2 tonnes</option>
              </select>
            </div>
          </>
        ) : (
          <Input
            id="eq-subject"
            label="Subject"
            value={form.subject}
            onChange={(value) => update("subject", value)}
          />
        )}

        <div className="sm:col-span-2">
          <label
            htmlFor="eq-message"
            className="block text-sm font-semibold text-ink-700"
          >
            {kind === "bulk" ? "What do you need?" : "Message"}{" "}
            <span className="text-chilli-600">*</span>
          </label>
          <textarea
            id="eq-message"
            rows={5}
            value={form.message}
            onChange={(event) => update("message", event.target.value)}
            placeholder={
              kind === "bulk"
                ? "Items, quantities and how often you would reorder…"
                : "How can we help?"
            }
            aria-invalid={Boolean(errors.message)}
            className={cx(
              "mt-2 w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm transition focus:outline-none focus:ring-4",
              errors.message
                ? "border-chilli-500 focus:ring-chilli-500/15"
                : "border-cream-300 focus:border-chilli-400 focus:ring-chilli-500/10",
            )}
          />
          {errors.message ? (
            <p className="mt-1.5 text-xs font-medium text-chilli-700">
              {errors.message}
            </p>
          ) : null}
        </div>
      </div>

      {/* Honeypot */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="eq-company">Company</label>
        <input
          id="eq-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={cx(
          "mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition sm:w-auto sm:px-10",
          submitting
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
            Sending…
          </>
        ) : kind === "bulk" ? (
          "Request bulk pricing"
        ) : (
          "Send message"
        )}
      </button>
    </form>
  );
}

function Input({
  id,
  label,
  value,
  onChange,
  error,
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
      ) : null}
    </div>
  );
}
