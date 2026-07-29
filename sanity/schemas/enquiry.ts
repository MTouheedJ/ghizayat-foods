import { defineField, defineType } from "sanity";

/** Written by /api/enquiries from the contact and bulk-order forms. */
export const enquiry = defineType({
  name: "enquiry",
  title: "Enquiry",
  type: "document",
  fields: [
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "Contact form", value: "contact" },
          { title: "Bulk / wholesale", value: "bulk" },
        ],
      },
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "In progress", value: "in-progress" },
          { title: "Closed", value: "closed" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    }),
    defineField({
      name: "receivedAt",
      title: "Received",
      type: "datetime",
      readOnly: true,
    }),
    defineField({ name: "name", title: "Name", type: "string", readOnly: true }),
    defineField({ name: "phone", title: "Phone", type: "string", readOnly: true }),
    defineField({ name: "email", title: "Email", type: "string", readOnly: true }),
    defineField({
      name: "businessName",
      title: "Business name",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "monthlyVolume",
      title: "Monthly volume",
      type: "string",
      readOnly: true,
    }),
    defineField({ name: "subject", title: "Subject", type: "string", readOnly: true }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 6,
      readOnly: true,
    }),
    defineField({
      name: "internalNotes",
      title: "Internal notes",
      type: "text",
      rows: 3,
      description: "For your team. Never shown on the website.",
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "receivedAtDesc",
      by: [{ field: "receivedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      name: "name",
      kind: "kind",
      subject: "subject",
      status: "status",
    },
    prepare({ name, kind, subject, status }) {
      return {
        title: `${name ?? "Unknown"}${kind === "bulk" ? " (bulk)" : ""}`,
        subtitle: `${subject || "No subject"} · ${status ?? "new"}`,
      };
    },
  },
});
