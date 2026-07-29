import type { NextApiRequest, NextApiResponse } from "next";

import { getSanityWriteClient } from "@/lib/sanity.client";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, SITE } from "@/lib/site";

/**
 * Cash-on-Delivery order intake.
 *
 * There is no separate backend — this Next.js API route is the backend. It
 * validates the submission, recomputes every total server-side (never trusting
 * the browser's arithmetic), and writes an `order` document into Sanity so the
 * shop sees it in the Studio alongside the catalogue.
 *
 * If no SANITY_API_WRITE_TOKEN is configured the order is still accepted and
 * logged, so the checkout flow is fully testable before the CMS is connected.
 */

type IncomingLine = {
  productId?: unknown;
  productSlug?: unknown;
  productTitle?: unknown;
  variantId?: unknown;
  variantLabel?: unknown;
  grams?: unknown;
  price?: unknown;
  quantity?: unknown;
};

type ValidLine = {
  productId: string;
  productSlug: string;
  productTitle: string;
  variantId: string;
  variantLabel: string;
  grams: number;
  price: number;
  quantity: number;
};

export type OrderResponse =
  | { ok: true; orderNumber: string; total: number; persisted: boolean }
  | { ok: false; error: string; fields?: Record<string, string> };

const MAX_LINES = 60;
const MAX_QUANTITY = 99;

/** Pakistani mobile/landline, with or without +92. */
const PHONE_RE = /^(?:\+?92|0)?3\d{9}$|^(?:\+?92|0)?[2-9]\d{7,10}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function positiveNumber(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

/** Simple in-memory throttle — enough to blunt casual abuse of a public form. */
const recentSubmissions = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (recentSubmissions.get(key) ?? []).filter(
    (time) => now - time < WINDOW_MS,
  );
  hits.push(now);
  recentSubmissions.set(key, hits);

  // Keep the map from growing without bound on a long-lived server.
  if (recentSubmissions.size > 5000) recentSubmissions.clear();

  return hits.length > MAX_PER_WINDOW;
}

function makeOrderNumber(): string {
  const now = new Date();
  const stamp = [
    now.getFullYear().toString().slice(2),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const suffix = Math.floor(Math.random() * 46656)
    .toString(36)
    .toUpperCase()
    .padStart(3, "0");
  return `GF-${stamp}-${suffix}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OrderResponse>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0]) ??
    req.socket.remoteAddress ??
    "unknown";

  if (isRateLimited(ip)) {
    return res.status(429).json({
      ok: false,
      error: "Too many orders from this device. Please wait a minute.",
    });
  }

  const body = (req.body ?? {}) as Record<string, unknown>;

  // Honeypot: real customers never fill a hidden field.
  if (text(body.company)) {
    return res.status(200).json({
      ok: true,
      orderNumber: makeOrderNumber(),
      total: 0,
      persisted: false,
    });
  }

  const customer = (body.customer ?? {}) as Record<string, unknown>;
  const name = text(customer.name);
  const phone = text(customer.phone).replace(/[\s-]/g, "");
  const email = text(customer.email);
  const address = text(customer.address);
  const city = text(customer.city);
  const notes = text(customer.notes).slice(0, 1000);

  const fields: Record<string, string> = {};
  if (name.length < 3) fields.name = "Please enter your full name.";
  if (!PHONE_RE.test(phone)) {
    fields.phone = "Enter a valid Pakistani phone number.";
  }
  if (email && !EMAIL_RE.test(email)) {
    fields.email = "That email address doesn't look right.";
  }
  if (address.length < 10) {
    fields.address = "Please give a complete delivery address.";
  }
  if (city.length < 2) fields.city = "Please enter your city.";

  // Validate lines
  const rawLines = Array.isArray(body.lines) ? body.lines : [];
  if (rawLines.length === 0) {
    return res.status(400).json({ ok: false, error: "Your cart is empty." });
  }
  if (rawLines.length > MAX_LINES) {
    return res
      .status(400)
      .json({ ok: false, error: "That's too many items for one order." });
  }

  const lines: ValidLine[] = [];
  for (const raw of rawLines as IncomingLine[]) {
    const price = positiveNumber(raw.price);
    const quantity = positiveNumber(raw.quantity);
    const grams = positiveNumber(raw.grams) ?? 0;
    const title = text(raw.productTitle);
    const variantId = text(raw.variantId);

    if (price === null || quantity === null || !title || !variantId) continue;
    if (quantity < 1 || quantity > MAX_QUANTITY) continue;

    lines.push({
      productId: text(raw.productId) || variantId,
      productSlug: text(raw.productSlug),
      productTitle: title.slice(0, 200),
      variantId,
      variantLabel: text(raw.variantLabel).slice(0, 60),
      grams,
      price,
      quantity: Math.floor(quantity),
    });
  }

  if (lines.length === 0) {
    return res
      .status(400)
      .json({ ok: false, error: "We couldn't read the items in your cart." });
  }

  if (Object.keys(fields).length > 0) {
    return res
      .status(400)
      .json({ ok: false, error: "Please check the highlighted fields.", fields });
  }

  // Totals are always recomputed here — the client's numbers are display-only.
  const subtotal = lines.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0,
  );
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const orderNumber = makeOrderNumber();
  const client = getSanityWriteClient();

  if (!client) {
    // Demo mode: no write token yet. Accept the order so the flow is testable.
    console.info(
      `[order] ${orderNumber} — ${lines.length} lines, ${SITE.currencySymbol} ${total} (not persisted: SANITY_API_WRITE_TOKEN missing)`,
    );
    return res
      .status(200)
      .json({ ok: true, orderNumber, total, persisted: false });
  }

  try {
    await client.create({
      _type: "order",
      orderNumber,
      status: "new",
      paymentMethod: "cod",
      placedAt: new Date().toISOString(),
      customer: { name, phone, email: email || undefined, address, city, notes },
      lines: lines.map((line) => ({
        _key: `${line.variantId}-${line.productId}`.slice(0, 60),
        productTitle: line.productTitle,
        productSlug: line.productSlug,
        variantLabel: line.variantLabel,
        grams: line.grams,
        price: line.price,
        quantity: line.quantity,
        lineTotal: line.price * line.quantity,
      })),
      subtotal,
      deliveryFee,
      total,
    });

    return res
      .status(200)
      .json({ ok: true, orderNumber, total, persisted: true });
  } catch (error) {
    console.error("[order] failed to save to Sanity:", error);
    // The customer's order is real even if our CMS write failed — accept it
    // and let the team reconcile from the server log rather than losing a sale.
    return res
      .status(200)
      .json({ ok: true, orderNumber, total, persisted: false });
  }
}
