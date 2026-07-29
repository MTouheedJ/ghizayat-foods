/**
 * Single source of truth for brand + storefront constants.
 * Everything configurable lives in .env.local; these are the safe defaults.
 */

const env = process.env;

export const SITE = {
  name: "Ghizayat Foods",
  localName: "غذایت فوڈز",
  tagline: "Pure Spices, Dry Fruits & Grains",
  description:
    "Ghizayat Foods supplies premium spices, dry fruits, nuts, pulses, rice and pure ghee — hand-graded, mill-fresh and delivered across Pakistan with cash on delivery.",
  url: (env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_PK",
  currency: "PKR",
  currencySymbol: "Rs",
  phone: env.NEXT_PUBLIC_CONTACT_PHONE || "+92-300-1234567",
  email: env.NEXT_PUBLIC_CONTACT_EMAIL || "info@ghizayatfoods.com",
  whatsapp: env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567",
  address: {
    street: "Main Boulevard, Gulberg III",
    city: "Lahore",
    region: "Punjab",
    postalCode: "54660",
    country: "PK",
  },
  hours: "Mon – Sun, 9:00 AM – 9:00 PM",
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
  },
} as const;

/** Flat delivery fee in PKR. */
export const DELIVERY_FEE = Number(env.NEXT_PUBLIC_DELIVERY_FEE ?? 250);

/** Spend at or above this and delivery is free. */
export const FREE_DELIVERY_THRESHOLD = Number(
  env.NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD ?? 5000,
);

/** How often statically generated pages refresh (seconds). */
export const REVALIDATE_SECONDS = 300;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/bulk-orders", label: "Bulk Orders" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
