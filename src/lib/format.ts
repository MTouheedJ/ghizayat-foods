import { SITE } from "./site";

/**
 * Currency formatting.
 *
 * Intl with `PKR` renders "PKR 1,234" on some engines and "Rs 1,234" on
 * others, so we format the number only and prepend the symbol ourselves —
 * identical output on server and client, which matters for hydration.
 */
const numberFormat = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number): string {
  return `${SITE.currencySymbol} ${numberFormat.format(Math.round(amount))}`;
}

export function formatPriceRange(min: number, max: number): string {
  if (min === max) return formatPrice(min);
  return `${formatPrice(min)} – ${formatPrice(max)}`;
}

export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    const kg = grams / 1000;
    return `${Number.isInteger(kg) ? kg : kg.toFixed(1)} kg`;
  }
  return `${grams} g`;
}

/** "Rs 1,560 / kg" — lets shoppers compare pack sizes honestly. */
export function formatUnitPrice(price: number, grams: number): string {
  if (!grams) return "";
  return `${formatPrice((price / grams) * 1000)} / kg`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Compact join used for classNames without pulling in a dependency. */
export function cx(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}
