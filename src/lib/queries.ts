/** GROQ projections. Kept beside the data layer so shapes stay in sync. */

const IMAGE = `{
  "url": asset->url,
  "lqip": asset->metadata.lqip,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  alt
}`;

const PRODUCT_FIELDS = `
  "id": _id,
  title,
  localTitle,
  "slug": slug.current,
  "category": category->{ title, "slug": slug.current },
  shortDescription,
  description,
  "images": images[]${IMAGE},
  "variants": variants[]{
    "id": _key,
    label,
    grams,
    price,
    compareAtPrice,
    sku,
    "inStock": coalesce(inStock, true)
  },
  origin,
  rating,
  "reviewCount": coalesce(reviewCount, 0),
  "isFeatured": coalesce(isFeatured, false),
  "isTrending": coalesce(isTrending, false),
  "isNewArrival": coalesce(isNewArrival, false)
`;

const CATEGORY_FIELDS = `
  "id": _id,
  title,
  localTitle,
  "slug": slug.current,
  description,
  "image": image${IMAGE},
  "order": coalesce(order, 99),
  "accent": coalesce(accent, "crimson")
`;

export const ALL_PRODUCTS_QUERY = `
  *[_type == "product" && defined(slug.current)] | order(title asc) {
    ${PRODUCT_FIELDS}
  }
`;

export const PRODUCT_BY_SLUG_QUERY = `
  *[_type == "product" && slug.current == $slug][0] {
    ${PRODUCT_FIELDS}
  }
`;

export const ALL_CATEGORIES_QUERY = `
  *[_type == "category" && defined(slug.current)] | order(order asc, title asc) {
    ${CATEGORY_FIELDS}
  }
`;

export const PRODUCT_SLUGS_QUERY = `
  *[_type == "product" && defined(slug.current)].slug.current
`;

export const CATEGORY_SLUGS_QUERY = `
  *[_type == "category" && defined(slug.current)].slug.current
`;
