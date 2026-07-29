import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * The variant object is where the money is. Every field has a plain-language
 * description and validation, so a non-technical editor cannot save a pack
 * with no price or a negative weight.
 */
const variant = defineArrayMember({
  name: "variant",
  title: "Pack size",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Size label",
      type: "string",
      description: 'What the customer sees, e.g. "500 g" or "1 kg".',
      validation: (rule) => rule.required().max(24),
    }),
    defineField({
      name: "grams",
      title: "Weight in grams",
      type: "number",
      description:
        "Always in grams — 1 kg = 1000. Used to sort sizes and show price per kg.",
      validation: (rule) => rule.required().positive().max(200000),
    }),
    defineField({
      name: "price",
      title: "Price (PKR)",
      type: "number",
      description: "Selling price for this pack size.",
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Was price (PKR)",
      type: "number",
      description:
        'Optional. Set this ABOVE the price to show a strike-through and a "sale" badge.',
      validation: (rule) =>
        rule.positive().custom((value, context) => {
          const parent = context.parent as { price?: number } | undefined;
          if (value === undefined || value === null) return true;
          if (parent?.price && value <= parent.price) {
            return 'The "was" price must be higher than the price.';
          }
          return true;
        }),
    }),
    defineField({
      name: "sku",
      title: "SKU / stock code",
      type: "string",
      description: "Optional internal code.",
    }),
    defineField({
      name: "inStock",
      title: "In stock",
      type: "boolean",
      description: "Turn OFF to grey this size out without deleting it.",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "label", price: "price", inStock: "inStock" },
    prepare({ title, price, inStock }) {
      return {
        title: title || "Untitled size",
        subtitle: `Rs ${price ?? 0}${inStock === false ? " · OUT OF STOCK" : ""}`,
      };
    },
  },
});

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "basics", title: "Basics", default: true },
    { name: "pricing", title: "Pack sizes & prices" },
    { name: "media", title: "Photos" },
    { name: "merch", title: "Placement" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Product name (English)",
      type: "string",
      group: "basics",
      validation: (rule) => rule.required().min(2).max(120),
    }),
    defineField({
      name: "localTitle",
      title: "Product name (Urdu)",
      type: "string",
      group: "basics",
      description: "Optional. Shown beneath the English name.",
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      group: "basics",
      description: 'Click "Generate". Becomes /products/your-slug.',
      options: { source: "title", maxLength: 90 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      group: "basics",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "One-line description",
      type: "string",
      group: "basics",
      description:
        "Shown on cards and in Google results. Keep it under 160 characters.",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "description",
      title: "Full description",
      type: "text",
      group: "basics",
      rows: 6,
      description: "The detail shown on the product page.",
    }),
    defineField({
      name: "origin",
      title: "Origin",
      type: "string",
      group: "basics",
      description: 'Where it comes from, e.g. "Kunri, Sindh".',
    }),

    defineField({
      name: "variants",
      title: "Pack sizes",
      type: "array",
      group: "pricing",
      of: [variant],
      description:
        "Add one entry per size you sell. At least one is required, or the product will not appear on the site.",
      validation: (rule) => rule.required().min(1).max(12),
    }),

    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      group: "media",
      description:
        "First photo is the main one. If you add none, a branded pattern is shown instead — the site will not look broken.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Describe the photo",
              type: "string",
              description:
                "Helps blind visitors and Google. e.g. \"Red chilli powder in a bowl\".",
            }),
          ],
        }),
      ],
      validation: (rule) => rule.max(8),
    }),

    defineField({
      name: "isTrending",
      title: "Show in “Trending this week”",
      type: "boolean",
      group: "merch",
      initialValue: false,
    }),
    defineField({
      name: "isNewArrival",
      title: "Mark as new arrival",
      type: "boolean",
      group: "merch",
      initialValue: false,
    }),
    defineField({
      name: "isFeatured",
      title: "Feature on the homepage",
      type: "boolean",
      group: "merch",
      initialValue: false,
    }),
    defineField({
      name: "rating",
      title: "Star rating",
      type: "number",
      group: "merch",
      description: "Optional, 0 to 5. Leave blank to hide stars.",
      validation: (rule) => rule.min(0).max(5),
    }),
    defineField({
      name: "reviewCount",
      title: "Number of reviews",
      type: "number",
      group: "merch",
      validation: (rule) => rule.min(0).integer(),
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category.title",
      media: "images.0",
      price: "variants.0.price",
    },
    prepare({ title, category, media, price }) {
      return {
        title,
        subtitle: [category, price ? `from Rs ${price}` : null]
          .filter(Boolean)
          .join(" · "),
        media,
      };
    },
  },
});
