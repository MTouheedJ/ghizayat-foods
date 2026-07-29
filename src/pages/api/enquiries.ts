import type { NextApiRequest, NextApiResponse } from "next";

import { getSanityWriteClient } from "@/lib/sanity.client";

/**
 * Contact and bulk-enquiry intake.
 *
 * Same pattern as the order route: validate here, persist into Sanity when a
 * write token exists, and degrade to a server-side log when it doesn't so the
 * form is testable before the CMS is wired up.
 */

export type EnquiryResponse =
  | { ok: true; persisted: boolean }
  | { ok: false; error: string; fields?: Record<string, string> };

const PHONE_RE = /^(?:\+?92|0)?3\d{9}$|^(?:\+?92|0)?[2-9]\d{7,10}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function text(value: unknown, max = 2000): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

const recent = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 4;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 5000) recent.clear();
  return hits.length > MAX_PER_WINDOW;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EnquiryResponse>,
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
    return res
      .status(429)
      .json({ ok: false, error: "Too many messages. Please wait a minute." });
  }

  const body = (req.body ?? {}) as Record<string, unknown>;

  if (text(body.company)) {
    return res.status(200).json({ ok: true, persisted: false });
  }

  const kind = text(body.kind) === "bulk" ? "bulk" : "contact";
  const name = text(body.name, 120);
  const phone = text(body.phone, 30).replace(/[\s-]/g, "");
  const email = text(body.email, 160);
  const subject = text(body.subject, 200);
  const message = text(body.message, 4000);
  const businessName = text(body.businessName, 160);
  const monthlyVolume = text(body.monthlyVolume, 120);

  const fields: Record<string, string> = {};
  if (name.length < 3) fields.name = "Please enter your name.";
  if (!PHONE_RE.test(phone)) fields.phone = "Enter a valid phone number.";
  if (email && !EMAIL_RE.test(email)) fields.email = "Check this email address.";
  if (message.length < 10) {
    fields.message = "Please tell us a little more (10 characters minimum).";
  }

  if (Object.keys(fields).length > 0) {
    return res.status(400).json({
      ok: false,
      error: "Please check the highlighted fields.",
      fields,
    });
  }

  const client = getSanityWriteClient();

  if (!client) {
    console.info(`[enquiry:${kind}] ${name} <${phone}> — ${subject || message.slice(0, 60)}`);
    return res.status(200).json({ ok: true, persisted: false });
  }

  try {
    await client.create({
      _type: "enquiry",
      kind,
      status: "new",
      receivedAt: new Date().toISOString(),
      name,
      phone,
      email: email || undefined,
      subject: subject || undefined,
      message,
      businessName: businessName || undefined,
      monthlyVolume: monthlyVolume || undefined,
    });
    return res.status(200).json({ ok: true, persisted: true });
  } catch (error) {
    console.error("[enquiry] failed to save to Sanity:", error);
    return res.status(200).json({ ok: true, persisted: false });
  }
}
