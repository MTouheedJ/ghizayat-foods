import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Name (English)",
      type: "string",
      description: 'For example "Spices" or "Dry Fruits & Nuts".',
      validation: (rule) => rule.required().min(2).max(60),
    }),
    defineField({
      name: "localTitle",
      title: "Name (Urdu)",
      type: "string",
      description: "Optional. Shown under the English name.",
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description:
        'Click "Generate". This becomes the page link, e.g. /categories/spices.',
      options: { source: "title", maxLength: 60 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "text",
      rows: 3,
      description: "One or two sentences shown on the category page.",
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "image",
      title: "Category photo",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional. If left empty, a branded pattern is shown instead.",
      fields: [
        defineField({
          name: "alt",
          title: "Describe the photo",
          type: "string",
          description: "Helps blind visitors and Google understand the image.",
        }),
      ],
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first. Leave blank for alphabetical.",
      initialValue: 10,
    }),
    defineField({
      name: "accent",
      title: "Accent colour",
      type: "string",
      description: "Tints the category header and product cards.",
      options: {
        list: [
          { title: "Chilli red", value: "crimson" },
          { title: "Royal blue", value: "royal" },
          { title: "Saffron", value: "saffron" },
          { title: "Emerald", value: "emerald" },
        ],
        layout: "radio",
      },
      initialValue: "crimson",
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "localTitle", media: "image" },
  },
});
