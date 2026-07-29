import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./sanity/schemas";

/**
 * Sanity Studio — the admin panel your team uses to manage products.
 *
 *   npm run studio          → run it locally at http://localhost:3333
 *   npm run studio:deploy   → publish it to https://<name>.sanity.studio (free)
 *
 * It is intentionally NOT mounted inside the Next.js app: the Studio bundle is
 * large, and keeping it separate means none of it can ever reach a customer's
 * browser or slow the storefront down.
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "ghizayat-foods",
  title: "Ghizayat Foods",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Products")
              .child(S.documentTypeList("product").title("Products")),
            S.listItem()
              .title("Categories")
              .child(S.documentTypeList("category").title("Categories")),
            S.divider(),
            S.listItem()
              .title("Orders")
              .child(
                S.documentTypeList("order")
                  .title("Orders")
                  .defaultOrdering([{ field: "placedAt", direction: "desc" }]),
              ),
            S.listItem()
              .title("Enquiries")
              .child(
                S.documentTypeList("enquiry")
                  .title("Enquiries")
                  .defaultOrdering([
                    { field: "receivedAt", direction: "desc" },
                  ]),
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
