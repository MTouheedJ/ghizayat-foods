import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Orders are written here by /api/orders. Editors read and update status —
 * they should never create one by hand, which is why the fields are read-only.
 */
export const order = defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order number",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description: "Update this as the order moves through the shop.",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Confirmed by phone", value: "confirmed" },
          { title: "Packed", value: "packed" },
          { title: "Out for delivery", value: "shipped" },
          { title: "Delivered & paid", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    }),
    defineField({
      name: "placedAt",
      title: "Placed at",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "paymentMethod",
      title: "Payment method",
      type: "string",
      readOnly: true,
      initialValue: "cod",
    }),
    defineField({
      name: "customer",
      title: "Customer",
      type: "object",
      readOnly: true,
      fields: [
        defineField({ name: "name", title: "Name", type: "string" }),
        defineField({ name: "phone", title: "Phone", type: "string" }),
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({ name: "address", title: "Address", type: "text", rows: 3 }),
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "notes", title: "Notes", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "lines",
      title: "Items",
      type: "array",
      readOnly: true,
      of: [
        defineArrayMember({
          type: "object",
          name: "line",
          fields: [
            defineField({ name: "productTitle", title: "Product", type: "string" }),
            defineField({ name: "productSlug", title: "Slug", type: "string" }),
            defineField({ name: "variantLabel", title: "Size", type: "string" }),
            defineField({ name: "grams", title: "Grams", type: "number" }),
            defineField({ name: "price", title: "Unit price", type: "number" }),
            defineField({ name: "quantity", title: "Qty", type: "number" }),
            defineField({ name: "lineTotal", title: "Line total", type: "number" }),
          ],
          preview: {
            select: {
              title: "productTitle",
              size: "variantLabel",
              qty: "quantity",
              total: "lineTotal",
            },
            prepare({ title, size, qty, total }) {
              return {
                title: `${qty ?? 1} × ${title ?? "Item"}`,
                subtitle: `${size ?? ""} — Rs ${total ?? 0}`,
              };
            },
          },
        }),
      ],
    }),
    defineField({ name: "subtotal", title: "Subtotal", type: "number", readOnly: true }),
    defineField({
      name: "deliveryFee",
      title: "Delivery fee",
      type: "number",
      readOnly: true,
    }),
    defineField({ name: "total", title: "Total", type: "number", readOnly: true }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "placedAtDesc",
      by: [{ field: "placedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      orderNumber: "orderNumber",
      name: "customer.name",
      city: "customer.city",
      total: "total",
      status: "status",
    },
    prepare({ orderNumber, name, city, total, status }) {
      return {
        title: `${orderNumber ?? "Order"} — ${name ?? "Unknown"}`,
        subtitle: `Rs ${total ?? 0} · ${city ?? "—"} · ${status ?? "new"}`,
      };
    },
  },
});
