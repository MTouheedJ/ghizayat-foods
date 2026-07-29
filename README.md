# Ghizayat Foods

A storefront for a Pakistani spice, dry-fruit and grain house — Next.js 16
(Pages Router), Tailwind v4, React Three Fiber, and Sanity as the CMS.

**It runs right now with built-in demo data.** No keys, no CMS account, no
database. Paste a Sanity project ID into `.env.local` and it switches to your
live catalogue automatically.

```bash
npm install
npm run dev          # http://localhost:3000
```

---

## Going live in four steps

### 1. Create the free Sanity project

```bash
npm run studio:init
```

Follow the prompts (login → create new project → dataset `production`). It
prints a **project ID**.

### 2. Paste the keys into `.env.local`

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xy     # ← the only required value
SANITY_API_WRITE_TOKEN=sk...               # ← lets checkout save orders
SANITY_REVALIDATE_SECRET=any-long-random-string
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Create the write token at **sanity.io/manage → API → Tokens → Add token →
Editor**.

Restart the dev server. Demo data is gone; your (empty) catalogue is live.

### 3. Publish the Studio for your team

```bash
npm run studio          # locally at http://localhost:3333
npm run studio:deploy   # free hosting at https://<name>.sanity.studio
```

That deployed URL is what a non-technical editor uses. They log in with Google
or email and can add products, prices, weights and photos — **no code, no
deployment, ever**.

### 4. Wire up instant publishing

In **sanity.io/manage → API → Webhooks**, add:

| Field | Value |
| --- | --- |
| URL | `https://your-domain.com/api/revalidate?secret=YOUR_SECRET` |
| Trigger on | Create, Update, Delete |
| Filter | `_type == "product" \|\| _type == "category"` |

Now "Publish" in the Studio refreshes the live site within seconds. Without the
webhook, pages still refresh on their own every 5 minutes.

---

## How the data layer works

Every page calls [`src/lib/data.ts`](src/lib/data.ts) — nothing else knows where
products come from:

```
getAllProducts()  getProductBySlug()  getAllCategories()  …
        │
        ├── NEXT_PUBLIC_SANITY_PROJECT_ID set? → Sanity (GROQ)
        └── otherwise                          → src/lib/demo-data.ts
```

If Sanity is configured but a query fails at build time, it **falls back to demo
data rather than failing the deploy**. Swapping to any other backend later means
editing this one file.

## Architecture notes

| Concern | Approach |
| --- | --- |
| **Backend** | None separate. `src/pages/api/*` is the backend — orders, enquiries, revalidation. |
| **Payments** | Cash on Delivery only, matching the reference site. No gateway, no card data ever collected. |
| **Orders** | Validated and re-totalled server-side (client numbers are display-only), then written to Sanity as `order` documents. |
| **Images** | Routed through Sanity's CDN via a custom `next/image` loader, so transformations don't consume the host's image-optimization quota. |
| **3D hero** | `next/dynamic` + `ssr:false`, mounted only when on-screen *and* idle. Skipped entirely on save-data, ≤2-core, no-WebGL, or reduced-motion devices. |
| **Rendering** | Every page is SSG + ISR (5 min). Product/category pages use `fallback: "blocking"`, so new CMS entries appear without a rebuild. |

## Commands

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build and serve |
| `npm run lint` | ESLint (flat config) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check` | Lint + typecheck together |
| `npm run studio` | Sanity Studio locally |
| `npm run studio:deploy` | Publish the Studio |

## Structure

```
src/
  components/    layout · product · home · forms · ui
  lib/           data.ts (source of truth) · cart · types · site config
  pages/         routes + api/
  styles/        globals.css — all brand tokens live here
sanity/
  schemas/       product · category · order · enquiry
```

Brand colours, fonts, shadows and animations are defined once in the `@theme`
block of [`src/styles/globals.css`](src/styles/globals.css).
