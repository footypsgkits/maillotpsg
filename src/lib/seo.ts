export const SITE = {
  name: "Maillot-PSG",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://maillot-psg.fr",
  shortName: "Maillot-PSG",
  description:
    "Boutique en ligne spécialisée maillots PSG : domicile, extérieur, third, gardien, rétro, training et collections enfant. Floquage personnalisé (5 €) Mbappé, Dembélé, Hakimi, Marquinhos, Donnarumma. Livraison France et Europe en 9 à 12 jours ouvrés.",
  baseline: "Maillots PSG personnalisés",
  email: "contact@maillot-psg.fr",
  address: {
    locality: "Paris",
    region: "Île-de-France",
    country: "FR",
  },
  social: {
    instagram: "https://www.instagram.com/maillot.psg",
    tiktok: "https://www.tiktok.com/@maillot.psg",
  },
};

export function absUrl(path = "/") {
  const base = SITE.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: SITE.name,
    url: SITE.url,
    logo: absUrl("/logo.png"),
    description: SITE.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    sameAs: [SITE.social.instagram, SITE.social.tiktok],
    contactPoint: {
      "@type": "ContactPoint",
      email: SITE.email,
      contactType: "customer service",
      areaServed: "FR",
      availableLanguage: ["French"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    inLanguage: "fr-FR",
  };
}

type ProductForLd = {
  name: string;
  slug: string;
  description: string;
  price: number;
  images: { url: string }[];
  sku?: string | null;
  stock: number;
  category: { name: string };
  ratingValue?: number | null;
  ratingCount?: number;
};

export function productJsonLd(p: ProductForLd) {
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    sku: p.sku ?? undefined,
    brand: { "@type": "Brand", name: SITE.name },
    category: p.category.name,
    image: p.images.map((i) => absUrl(i.url)),
    offers: {
      "@type": "Offer",
      url: absUrl(`/produit/${p.slug}`),
      priceCurrency: "EUR",
      price: p.price.toFixed(2),
      availability:
        p.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString().slice(0, 10),
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "EUR" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "FR" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 8, maxValue: 10, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "FR",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
  };
  if (p.ratingValue && p.ratingCount && p.ratingCount > 0) {
    ld.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: p.ratingValue.toFixed(1),
      reviewCount: p.ratingCount,
      bestRating: 5,
      worstRating: 1,
    };
  }
  return ld;
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absUrl(it.url),
    })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function itemListJsonLd(
  items: { name: string; url: string; image?: string }[],
  listName?: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absUrl(it.url),
      name: it.name,
      image: it.image ? absUrl(it.image) : undefined,
    })),
  };
}

export function personJsonLd(p: {
  name: string;
  slug: string;
  bio: string;
  imageUrl?: string | null;
  nationality?: string | null;
  position?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    url: absUrl(`/joueur/${p.slug}`),
    description: p.bio.slice(0, 300),
    image: p.imageUrl ? absUrl(p.imageUrl) : undefined,
    nationality: p.nationality ?? undefined,
    jobTitle: p.position ? `Footballeur (${p.position})` : "Footballeur",
    affiliation: {
      "@type": "SportsTeam",
      name: "Paris Saint-Germain",
    },
  };
}

export function articleJsonLd(g: {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: Date;
  updatedAt: Date;
  imageUrl?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.excerpt,
    image: g.imageUrl ? absUrl(g.imageUrl) : absUrl("/logo.png"),
    datePublished: g.publishedAt.toISOString(),
    dateModified: g.updatedAt.toISOString(),
    author: { "@type": "Organization", name: SITE.name },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: absUrl("/logo.png") },
    },
    mainEntityOfPage: absUrl(`/guide/${g.slug}`),
  };
}

// Mots-clés stratégiques par cluster — utilisés pour fallback metadata
export const KEYWORDS = {
  global: [
    "maillot psg",
    "maillot paris saint-germain",
    "maillot psg pas cher",
    "maillot psg personnalisé",
    "maillot psg authentique",
    "boutique maillot psg",
    "maillot psg homme",
    "maillot psg femme",
    "maillot psg enfant",
    "maillot psg floqué",
    "maillot psg floquage",
  ],
  domicile: [
    "maillot psg domicile",
    "maillot psg domicile 2025 2026",
    "maillot psg bleu marine",
    "maillot psg home",
  ],
  exterieur: [
    "maillot psg extérieur",
    "maillot psg extérieur 2025 2026",
    "maillot psg away",
    "maillot psg blanc",
  ],
  third: [
    "maillot psg third",
    "maillot psg third 2025 2026",
    "troisième maillot psg",
  ],
  fourth: [
    "maillot psg fourth",
    "quatrième maillot psg",
  ],
  gardien: [
    "maillot gardien psg",
    "maillot donnarumma",
    "maillot gardien psg 2025 2026",
  ],
  enfant: [
    "maillot psg enfant",
    "maillot psg enfant pas cher",
    "maillot psg 8 ans",
    "maillot psg 10 ans",
    "maillot psg 12 ans",
    "maillot psg 14 ans",
  ],
  retro: [
    "maillot psg rétro",
    "maillot psg vintage",
    "maillot psg ronaldinho",
    "maillot psg ibrahimovic",
    "maillot psg beckham",
    "maillot psg neymar",
    "maillot psg cavani",
    "maillot psg pauleta",
    "maillot psg collector",
  ],
  training: [
    "survêtement psg",
    "training psg",
    "veste psg",
    "polo psg",
  ],
};
