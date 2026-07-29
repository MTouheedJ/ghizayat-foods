/**
 * Built-in demo catalogue.
 *
 * Renders a complete, believable storefront before any Sanity keys exist, so
 * the site is never "broken pending CMS". Once NEXT_PUBLIC_SANITY_PROJECT_ID
 * is set, none of this is used.
 *
 * Everything here is deterministic — no Math.random / Date.now — so server and
 * client markup always match and static builds are reproducible.
 */

import type { Category, Product, Variant } from "./types";

/* ── Pricing model ─────────────────────────────────────────────────────────
   Smaller packs carry a higher per-kg price, exactly like a real spice house.
   This is what produces the "Rs 54 – Rs 818" style ranges on the cards.       */

const SIZE_MARKUP: Array<[maxGrams: number, markup: number]> = [
  [50, 1.34],
  [100, 1.22],
  [250, 1.1],
  [500, 1.04],
  [1000, 1.0],
  [5000, 0.94],
  [Infinity, 0.88],
];

function markupFor(grams: number): number {
  return SIZE_MARKUP.find(([max]) => grams <= max)![1];
}

function formatWeight(grams: number): string {
  if (grams >= 1000) {
    const kg = grams / 1000;
    return `${Number.isInteger(kg) ? kg : kg.toFixed(1)} kg`;
  }
  return `${grams} g`;
}

/** Deterministic pseudo-random in [0,1) derived from a string. */
function hashUnit(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

function buildVariants(
  slug: string,
  pricePerKg: number,
  weights: number[],
  discountPct: number,
): Variant[] {
  return weights.map((grams, index) => {
    const raw = (pricePerKg * grams * markupFor(grams)) / 1000;
    const price = Math.max(10, Math.round(raw));
    const compareAtPrice =
      discountPct > 0 ? Math.round(price / (1 - discountPct / 100)) : null;

    // Deterministically mark the odd large pack as out of stock, like a real shop.
    const inStock = hashUnit(`${slug}:${grams}`) > 0.08;

    return {
      id: `${slug}-${grams}`,
      label: formatWeight(grams),
      grams,
      price,
      compareAtPrice,
      sku: `GF-${slug.toUpperCase().replace(/-/g, "").slice(0, 6)}-${grams}`,
      inStock: index === 0 ? true : inStock,
    } satisfies Variant;
  });
}

/* ── Categories ────────────────────────────────────────────────────────────*/

type CategorySpec = {
  slug: string;
  title: string;
  localTitle: string;
  description: string;
  accent: Category["accent"];
  weights: number[];
};

const CATEGORY_SPECS: CategorySpec[] = [
  {
    slug: "spices",
    title: "Spices",
    localTitle: "مصالحہ جات",
    description:
      "Stone-ground and whole spices, milled in small batches so the oils stay in the powder and not in the packaging.",
    accent: "crimson",
    weights: [50, 100, 250, 500, 1000],
  },
  {
    slug: "dry-fruits",
    title: "Dry Fruits & Nuts",
    localTitle: "خشک میوہ جات",
    description:
      "Hand-graded almonds, pistachios, walnuts and dates sourced from Gilgit, Quetta and the Gulf.",
    accent: "saffron",
    weights: [100, 250, 500, 1000],
  },
  {
    slug: "pulses",
    title: "Pulses & Lentils",
    localTitle: "دالیں",
    description:
      "Double-cleaned daals with the grit, husk and broken grain sorted out before they reach you.",
    accent: "emerald",
    weights: [500, 1000, 5000],
  },
  {
    slug: "rice",
    title: "Rice",
    localTitle: "چاول",
    description:
      "Aged Punjab basmati with long, unbroken grain and the aroma that only proper storage gives.",
    accent: "royal",
    weights: [1000, 5000, 25000],
  },
  {
    slug: "oil-and-ghee",
    title: "Oil & Ghee",
    localTitle: "تیل و گھی",
    description:
      "Pure desi ghee and cold-pressed oils, packed in food-grade tins that keep light out.",
    accent: "saffron",
    weights: [500, 1000, 2500],
  },
  {
    slug: "murrabajat",
    title: "Murrabajat",
    localTitle: "مربہ جات",
    description:
      "Slow-cooked preserves — amla, apple and carrot — set in heavy sugar syrup the traditional way.",
    accent: "crimson",
    weights: [450, 900],
  },
  {
    slug: "herbs-and-tea",
    title: "Herbs & Tea",
    localTitle: "جڑی بوٹیاں و چائے",
    description:
      "Medicinal herbs and leaf teas, stored whole and sold by weight to keep them potent.",
    accent: "emerald",
    weights: [50, 100, 250],
  },
];

export const DEMO_CATEGORIES: Category[] = CATEGORY_SPECS.map(
  (spec, index) => ({
    id: `category-${spec.slug}`,
    title: spec.title,
    localTitle: spec.localTitle,
    slug: spec.slug,
    description: spec.description,
    image: null,
    order: index,
    accent: spec.accent,
  }),
);

/* ── Products ──────────────────────────────────────────────────────────────*/

type ProductSpec = {
  slug: string;
  title: string;
  localTitle: string;
  category: string;
  pricePerKg: number;
  origin: string;
  short: string;
  description: string;
  discountPct?: number;
};

const PRODUCT_SPECS: ProductSpec[] = [
  // ── Spices ───────────────────────────────────────────────────────────────
  {
    slug: "surkh-mirch-powder",
    title: "Surkh Mirch Powder",
    localTitle: "سرخ مرچ پاؤڈر",
    category: "spices",
    pricePerKg: 780,
    origin: "Kunri, Sindh",
    short: "Deep-red chilli powder with heat that builds slowly.",
    description:
      "Sun-dried Kunri chillies, de-stemmed by hand and stone-ground so the colour stays bright rather than turning brown. Kunri grows more than half of Pakistan's red chilli, and the difference shows in the colour it lends a salan.",
    discountPct: 10,
  },
  {
    slug: "haldi-powder",
    title: "Haldi Powder",
    localTitle: "ہلدی پاؤڈر",
    category: "spices",
    pricePerKg: 560,
    origin: "Kasur, Punjab",
    short: "High-curcumin turmeric, milled fine and unblended.",
    description:
      "Whole turmeric fingers cured, dried and milled in small batches. Nothing is added to bulk it out — the colour you see is the root's own.",
  },
  {
    slug: "kali-mirch-sabat",
    title: "Kali Mirch Sabat",
    localTitle: "کالی مرچ ثابت",
    category: "spices",
    pricePerKg: 2450,
    origin: "Vietnam",
    short: "Whole black peppercorns, heavy and uniformly sized.",
    description:
      "Bold 550 g/l peppercorns that grind clean without dust. Whole pepper keeps its punch for years; ground pepper loses it in months, which is why we sell it like this.",
  },
  {
    slug: "zeera-safaid",
    title: "Zeera Safaid",
    localTitle: "زیرہ سفید",
    category: "spices",
    pricePerKg: 1650,
    origin: "Balochistan",
    short: "White cumin seed, cleaned to 99.5% purity.",
    description:
      "Balochi cumin with a warmer, sweeter note than the Indian varieties. Triple-sieved so there is no grit left in the seed.",
    discountPct: 8,
  },
  {
    slug: "dhania-sabat",
    title: "Dhania Sabat",
    localTitle: "دھنیا ثابت",
    category: "spices",
    pricePerKg: 620,
    origin: "Punjab",
    short: "Whole coriander seed, citrus-forward and pale gold.",
    description:
      "Eagle-variety coriander with a high oil content. Dry-roast for a minute before grinding and the difference is unmistakable.",
  },
  {
    slug: "garam-masala",
    title: "Garam Masala",
    localTitle: "گرم مصالحہ",
    category: "spices",
    pricePerKg: 2900,
    origin: "House blend",
    short: "Our own blend — nine spices, roasted then ground.",
    description:
      "Green and black cardamom, cinnamon, clove, black pepper, bay, mace, nutmeg and cumin. Each is roasted separately to its own point, then blended and ground together.",
  },
  {
    slug: "ajwain",
    title: "Ajwain",
    localTitle: "اجوائن",
    category: "spices",
    pricePerKg: 540,
    origin: "Punjab",
    short: "Carom seed with a sharp thyme-like bite.",
    description:
      "Pungent enough that a pinch carries a whole paratha dough. Also the traditional remedy for a heavy stomach.",
  },
  {
    slug: "kalonji",
    title: "Kalonji",
    localTitle: "کلونجی",
    category: "spices",
    pricePerKg: 690,
    origin: "Punjab",
    short: "Nigella seed — jet black, cleaned and dust-free.",
    description:
      "The seed the Prophet ﷺ described as a cure for every ailment but death. We sell it whole and unwashed of its own oil.",
  },
  {
    slug: "sonf",
    title: "Sonf",
    localTitle: "سونف",
    category: "spices",
    pricePerKg: 720,
    origin: "Punjab",
    short: "Green fennel seed, sweet and aromatic.",
    description:
      "Bold green fennel, the kind served after a meal rather than the pale cooking grade. Sorted for colour so the batch stays even.",
  },
  {
    slug: "elaichi-sabz",
    title: "Elaichi Sabz",
    localTitle: "الائچی سبز",
    category: "spices",
    pricePerKg: 9800,
    origin: "Guatemala",
    short: "Green cardamom, 8mm bold pods.",
    description:
      "Plump, tightly-closed pods with black, sticky seed inside — the sign they were picked ripe and dried slowly. Expensive, and worth it.",
    discountPct: 5,
  },
  {
    slug: "darchini",
    title: "Darchini",
    localTitle: "دارچینی",
    category: "spices",
    pricePerKg: 1150,
    origin: "Sri Lanka",
    short: "True cinnamon quills, thin and layered.",
    description:
      "Ceylon cinnamon rather than the thicker cassia most shops sell. Milder, sweeter, and it crumbles between your fingers.",
  },
  {
    slug: "laung",
    title: "Laung",
    localTitle: "لونگ",
    category: "spices",
    pricePerKg: 3200,
    origin: "Indonesia",
    short: "Whole cloves with the head still intact.",
    description:
      "Hand-picked before the bud opens, which is where the oil sits. Heavy, dark and strongly aromatic.",
  },

  // ── Dry fruits ───────────────────────────────────────────────────────────
  {
    slug: "badam-giri",
    title: "Badam Giri",
    localTitle: "بادام گری",
    category: "dry-fruits",
    pricePerKg: 3450,
    origin: "Gilgit-Baltistan",
    short: "Almond kernels, hand-shelled and unbroken.",
    description:
      "Mountain almonds from Hunza — smaller than Californian stock but far sweeter, with a firmer bite. Shelled by hand so the kernel stays whole.",
    discountPct: 12,
  },
  {
    slug: "akhrot-giri",
    title: "Akhrot Giri",
    localTitle: "اخروٹ گری",
    category: "dry-fruits",
    pricePerKg: 3200,
    origin: "Gilgit-Baltistan",
    short: "Light-halves walnut kernels, freshly cracked.",
    description:
      "Pale, sweet halves with none of the bitterness that comes from old stock. Walnut oil turns quickly, so we crack to order and rotate hard.",
  },
  {
    slug: "kaju",
    title: "Kaju",
    localTitle: "کاجو",
    category: "dry-fruits",
    pricePerKg: 4100,
    origin: "Vietnam",
    short: "W240 grade cashews — large, ivory, unbroken.",
    description:
      "Whole white cashews, roasted lightly or sold raw. W240 means roughly 240 kernels to the pound, which is the size most people picture when they think of a good cashew.",
  },
  {
    slug: "pista",
    title: "Pista",
    localTitle: "پستہ",
    category: "dry-fruits",
    pricePerKg: 5600,
    origin: "Iran",
    short: "Salted, naturally-split Iranian pistachios.",
    description:
      "Akbari pistachios — long kernels, deep green, split along the shell on the tree rather than by machine.",
    discountPct: 7,
  },
  {
    slug: "khajoor-amber",
    title: "Khajoor Amber",
    localTitle: "کھجور عنبر",
    category: "dry-fruits",
    pricePerKg: 2650,
    origin: "Madinah",
    short: "Soft Amber dates, large and honey-dark.",
    description:
      "Amber dates carry a caramel note and a soft, almost fudge-like flesh. Stored cold so they never dry out or crystallise.",
  },
  {
    slug: "anjeer",
    title: "Anjeer",
    localTitle: "انجیر",
    category: "dry-fruits",
    pricePerKg: 3900,
    origin: "Afghanistan",
    short: "Dried figs, plump and naturally sweet.",
    description:
      "Afghan figs sun-dried whole. Soft enough to eat as they are, and the seeds still crunch.",
  },
  {
    slug: "kishmish",
    title: "Kishmish",
    localTitle: "کشمش",
    category: "dry-fruits",
    pricePerKg: 1180,
    origin: "Afghanistan",
    short: "Long green seedless raisins.",
    description:
      "Shade-dried rather than sun-dried, which is what keeps them green instead of browning. Firm, tart and not oiled.",
  },
  {
    slug: "chilgoza",
    title: "Chilgoza",
    localTitle: "چلغوزہ",
    category: "dry-fruits",
    pricePerKg: 14500,
    origin: "Chilas, KPK",
    short: "Pine nuts in shell — the winter luxury.",
    description:
      "Harvested from wild chilgoza pines in the northern belt, where a single tree takes decades to bear. Priced accordingly, and unlike anything else.",
  },
  {
    slug: "munaqqa",
    title: "Munaqqa",
    localTitle: "منقہ",
    category: "dry-fruits",
    pricePerKg: 1450,
    origin: "Afghanistan",
    short: "Large seeded raisins used in tonics.",
    description:
      "Bigger and darker than kishmish, with seeds left in. Soaked overnight, it is a traditional remedy for cough and weakness.",
  },
  {
    slug: "khubani",
    title: "Khubani",
    localTitle: "خوبانی",
    category: "dry-fruits",
    pricePerKg: 1650,
    origin: "Hunza",
    short: "Sun-dried Hunza apricots, unsulphured.",
    description:
      "Brown rather than orange, because nothing is added to preserve the colour. The taste is concentrated and slightly tangy.",
    discountPct: 10,
  },

  // ── Pulses ───────────────────────────────────────────────────────────────
  {
    slug: "daal-chana",
    title: "Daal Chana",
    localTitle: "دال چنا",
    category: "pulses",
    pricePerKg: 340,
    origin: "Punjab",
    short: "Split bengal gram, polished and uniform.",
    description:
      "Machine-graded for size so the daal cooks evenly instead of turning to paste at the edges while the centre stays hard.",
  },
  {
    slug: "daal-masoor",
    title: "Daal Masoor",
    localTitle: "دال مسور",
    category: "pulses",
    pricePerKg: 315,
    origin: "Punjab",
    short: "Split red lentil, quick-cooking.",
    description:
      "Cooks down in twenty minutes without soaking. Double-cleaned to remove stones — you should never have to pick through it.",
  },
  {
    slug: "daal-moong",
    title: "Daal Moong",
    localTitle: "دال مونگ",
    category: "pulses",
    pricePerKg: 395,
    origin: "Punjab",
    short: "Split, skinless yellow mung.",
    description:
      "The lightest of the daals and the one prescribed for anyone recovering from illness. Cooks to a smooth, pale gold.",
  },
  {
    slug: "daal-mash",
    title: "Daal Mash",
    localTitle: "دال ماش",
    category: "pulses",
    pricePerKg: 480,
    origin: "Punjab",
    short: "Split white urad, skinless.",
    description:
      "Holds its shape when cooked, which is what a proper daal mash needs — separate grains, not a purée.",
    discountPct: 6,
  },
  {
    slug: "lobia",
    title: "Lobia",
    localTitle: "لوبیا",
    category: "pulses",
    pricePerKg: 385,
    origin: "Punjab",
    short: "Black-eyed peas, whole and clean.",
    description:
      "Even-sized white beans with the distinctive black eye. Soak for four hours and they cook fast.",
  },
  {
    slug: "safaid-chana",
    title: "Safaid Chana",
    localTitle: "سفید چنا",
    category: "pulses",
    pricePerKg: 420,
    origin: "Punjab",
    short: "Kabuli chickpeas, bold 9mm grade.",
    description:
      "Large, pale chickpeas that swell properly overnight. The bigger grades are what you want for chana chaat.",
  },

  // ── Rice ─────────────────────────────────────────────────────────────────
  {
    slug: "super-kernel-basmati",
    title: "Super Kernel Basmati",
    localTitle: "سپر کرنل باسمتی",
    category: "rice",
    pricePerKg: 420,
    origin: "Kalar Belt, Punjab",
    short: "Aged two years. Extra-long, unbroken grain.",
    description:
      "Grown in the Kalar tract between the Ravi and Chenab, the only soil that gives basmati its aroma. Aged twenty-four months so the grain firms up and cooks separate every time.",
    discountPct: 8,
  },
  {
    slug: "sella-basmati",
    title: "Sella Basmati",
    localTitle: "سیلہ باسمتی",
    category: "rice",
    pricePerKg: 385,
    origin: "Punjab",
    short: "Parboiled golden basmati for biryani.",
    description:
      "Steamed in the husk before milling, which drives the nutrients inward and hardens the grain. The rice of choice when you are cooking for eighty people and cannot risk it breaking.",
  },
  {
    slug: "steam-basmati",
    title: "Steam Basmati",
    localTitle: "سٹیم باسمتی",
    category: "rice",
    pricePerKg: 405,
    origin: "Punjab",
    short: "Steamed white basmati, everyday grade.",
    description:
      "Cleaner and firmer than raw basmati, with less breakage in the bag. Good daily rice for pulao and plain boiled.",
  },
  {
    slug: "kainat-rice",
    title: "Kainat Rice",
    localTitle: "کائنات چاول",
    category: "rice",
    pricePerKg: 355,
    origin: "Punjab",
    short: "Long-grain everyday rice, excellent value.",
    description:
      "Not basmati, and not pretending to be — but a clean, long grain that cooks well and costs meaningfully less.",
  },

  // ── Oil & ghee ───────────────────────────────────────────────────────────
  {
    slug: "desi-ghee",
    title: "Desi Ghee",
    localTitle: "دیسی گھی",
    category: "oil-and-ghee",
    pricePerKg: 2450,
    origin: "Sahiwal, Punjab",
    short: "Pure cow butter-oil, kettle-clarified.",
    description:
      "Made from cultured cream in open kettles, not centrifuged from cream powder. It grains as it cools — which is exactly what real ghee should do.",
    discountPct: 10,
  },
  {
    slug: "banaspati-ghee",
    title: "Banaspati Ghee",
    localTitle: "بناسپتی گھی",
    category: "oil-and-ghee",
    pricePerKg: 620,
    origin: "Pakistan",
    short: "Vegetable ghee for everyday frying.",
    description:
      "Stable at high heat and priced for a working kitchen. Packed in tins so it does not pick up smells.",
  },
  {
    slug: "sarson-ka-tel",
    title: "Sarson Ka Tel",
    localTitle: "سرسوں کا تیل",
    category: "oil-and-ghee",
    pricePerKg: 750,
    origin: "Punjab",
    short: "Cold-pressed mustard oil, kachi ghani.",
    description:
      "Pressed in a wooden ghani at low speed so the oil never heats. Sharp, pungent, and the only thing for a proper saag.",
  },
  {
    slug: "zaitoon-oil",
    title: "Zaitoon Oil",
    localTitle: "زیتون کا تیل",
    category: "oil-and-ghee",
    pricePerKg: 3200,
    origin: "Spain",
    short: "Extra-virgin olive oil, first cold press.",
    description:
      "Low acidity, grassy and green. Bottled in dark glass because light is what turns olive oil rancid.",
  },

  // ── Murrabajat ───────────────────────────────────────────────────────────
  {
    slug: "murabba-aamla",
    title: "Murabba Aamla",
    localTitle: "مربہ آملہ",
    category: "murrabajat",
    pricePerKg: 780,
    origin: "House-made",
    short: "Whole amla preserved in heavy syrup.",
    description:
      "Indian gooseberry pricked, blanched and steeped in sugar syrup over several days until it turns translucent. Very high in vitamin C.",
  },
  {
    slug: "murabba-seb",
    title: "Murabba Seb",
    localTitle: "مربہ سیب",
    category: "murrabajat",
    pricePerKg: 850,
    origin: "House-made",
    short: "Apple preserve, cardamom-scented.",
    description:
      "Swat apples cooked whole and slow, with green cardamom and a little saffron added at the end.",
    discountPct: 15,
  },
  {
    slug: "murabba-gajar",
    title: "Murabba Gajar",
    localTitle: "مربہ گاجر",
    category: "murrabajat",
    pricePerKg: 720,
    origin: "House-made",
    short: "Red carrot preserve, thick and dark.",
    description:
      "Made only in winter when the red carrots come in. Cooked down until the syrup coats a spoon.",
  },

  // ── Herbs & tea ──────────────────────────────────────────────────────────
  {
    slug: "sabz-chai",
    title: "Sabz Chai",
    localTitle: "سبز چائے",
    category: "herbs-and-tea",
    pricePerKg: 1850,
    origin: "China",
    short: "Loose-leaf green tea, gunpowder rolled.",
    description:
      "Tightly rolled leaf that unfurls in the pot. Keeps far longer than open-leaf tea because less surface is exposed.",
  },
  {
    slug: "kashmiri-chai",
    title: "Kashmiri Chai Patti",
    localTitle: "کشمیری چائے پتی",
    category: "herbs-and-tea",
    pricePerKg: 2200,
    origin: "Kashmir",
    short: "The leaf that turns pink with soda.",
    description:
      "Special green leaf blended for noon chai. Whisked long with a pinch of soda, it goes from green to deep pink.",
    discountPct: 10,
  },
  {
    slug: "mulethi",
    title: "Mulethi",
    localTitle: "ملیٹھی",
    category: "herbs-and-tea",
    pricePerKg: 980,
    origin: "Afghanistan",
    short: "Liquorice root, cut and sifted.",
    description:
      "Naturally sweet root chewed for sore throats or brewed into a tea. Cut to an even length rather than sold as dust.",
  },
  {
    slug: "sana-makki",
    title: "Sana Makki",
    localTitle: "سنا مکی",
    category: "herbs-and-tea",
    pricePerKg: 890,
    origin: "Makkah",
    short: "Senna leaf, whole and green.",
    description:
      "Traditional cleansing herb, brewed weak. Sold as whole leaf so you can see the quality rather than trusting a powder.",
  },
];

const CATEGORY_BY_SLUG = new Map(
  CATEGORY_SPECS.map((spec) => [spec.slug, spec]),
);

export const DEMO_PRODUCTS: Product[] = PRODUCT_SPECS.map((spec, index) => {
  const category = CATEGORY_BY_SLUG.get(spec.category)!;
  const seed = hashUnit(spec.slug);

  return {
    id: `product-${spec.slug}`,
    title: spec.title,
    localTitle: spec.localTitle,
    slug: spec.slug,
    category: { title: category.title, slug: category.slug },
    shortDescription: spec.short,
    description: spec.description,
    images: [],
    variants: buildVariants(
      spec.slug,
      spec.pricePerKg,
      category.weights,
      spec.discountPct ?? 0,
    ),
    origin: spec.origin,
    rating: Number((3.9 + seed * 1.1).toFixed(1)),
    reviewCount: 8 + Math.floor(seed * 240),
    isFeatured: index % 7 === 0,
    isTrending: seed > 0.62,
    isNewArrival: index % 9 === 3,
  } satisfies Product;
});
