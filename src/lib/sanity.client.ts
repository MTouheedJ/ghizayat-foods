import { createClient, type SanityClient } from "@sanity/client";

export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const SANITY_DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const SANITY_API_VERSION =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

/**
 * The master switch.
 *
 * No project id => the whole app transparently serves the built-in demo
 * catalogue. Paste a real id into .env.local and every page starts reading
 * from Sanity instead, with no code changes.
 */
export const isSanityConfigured = SANITY_PROJECT_ID.trim().length > 0;

let cachedClient: SanityClient | null = null;

/** Read-only client used by getStaticProps. Returns null when unconfigured. */
export function getSanityClient(): SanityClient | null {
  if (!isSanityConfigured) return null;
  if (cachedClient) return cachedClient;

  cachedClient = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    // Served from Sanity's global CDN — fast and cheap against the free quota.
    useCdn: true,
    token: process.env.SANITY_API_READ_TOKEN || undefined,
    perspective: "published",
  });

  return cachedClient;
}

/**
 * Write client for the Cash-on-Delivery checkout. Server-side only — the token
 * must never reach the browser, so this is only ever called from /api routes.
 */
export function getSanityWriteClient(): SanityClient | null {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!isSanityConfigured || !token) return null;

  return createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    useCdn: false,
    token,
  });
}
