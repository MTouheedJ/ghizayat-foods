import { defineCliConfig } from "sanity/cli";

/**
 * CLI config for the Studio (`npm run studio`, `npm run studio:deploy`).
 * Reads the same env vars as the website, so there is one place to configure.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
});
