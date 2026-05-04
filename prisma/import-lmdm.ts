import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter, log: ["error"] });

type ScrapedProduct = {
  handle: string;
  title: string;
  image: string;
  price: number | null;
  oldPrice: number | null;
  page: number;
  href: string;
};

type Kind =
  | "domicile"
  | "exterieur"
  | "third"
  | "fourth"
  | "concept"
  | "retro"
  | "gardien"
  | "training"
  | "shorts"
  | "edition-speciale";

type Gender = "homme" | "femme" | "enfant";

const ADULT_SIZES = ["S", "M", "L", "XL", "XXL", "3XL"].map((label, i) => ({
  label,
  kind: "adulte" as const,
  position: i,
}));
const KID_SIZES = ["4 ans", "6 ans", "8 ans", "10 ans", "12 ans", "14 ans"].map(
  (label, i) => ({ label, kind: "enfant" as const, position: i }),
);

// --- Détection kind ----------------------------------------------------------
function detectKind(title: string): Kind {
  const t = title.toLowerCase();
  if (/gardien|goalkeeper/.test(t)) return "gardien";
  if (/training|entra[iî]nement|survêtement|survetement|pre[\s-]?match|warm[\s-]?up/.test(t))
    return "training";
  if (/\bshort\b|short de football/.test(t)) return "shorts";
  if (/r[ée]tro|retro\b/.test(t)) return "retro";
  if (/concept/.test(t)) return "concept";
  if (/fourth/.test(t)) return "fourth";
  if (/third/.test(t)) return "third";
  if (/ext[ée]rieur|\baway\b/.test(t)) return "exterieur";
  if (/domicile/.test(t)) return "domicile";
  // Fallback : titre PSG sans précision = maillot principal (domicile)
  return "domicile";
}

function detectGender(title: string): Gender {
  const t = title.toLowerCase();
  if (/\benfant\b|\bkid\b|kit enfant/.test(t)) return "enfant";
  if (/\bfemme\b|\bwomen\b|\bwoman\b/.test(t)) return "femme";
  return "homme";
}

// Catégorie = mapping depuis kind + gender
function categorySlugFor(kind: Kind, gender: Gender): string {
  if (gender === "enfant") return "enfant";
  return kind;
}

// --- Détection saison --------------------------------------------------------
type SeasonInfo = {
  seasonSlug: string; // ex "2025-2026" ou "retro-2018-2019"
  label: string; // ex "2025-2026"
  era: "actuelle" | "recente" | "retro";
};

function detectSeason(title: string, kind: Kind): SeasonInfo | null {
  // Cherche deux années consécutives "YYYY YYYY", "YYYY-YYYY", "YYYY/YYYY"
  const m = title.match(/(\d{4})\s*[-/ ]\s*(\d{2,4})/);
  if (m) {
    let y1 = parseInt(m[1], 10);
    let y2raw = m[2];
    let y2 = y2raw.length === 2 ? parseInt(`${m[1].slice(0, 2)}${y2raw}`, 10) : parseInt(y2raw, 10);
    if (y2 - y1 === 1 && y1 >= 1990 && y1 <= 2030) {
      const label = `${y1}-${y2}`;
      const era: SeasonInfo["era"] =
        kind === "retro" || y1 < 2023 ? "retro" : y1 === 2023 || y1 === 2024 ? "recente" : "actuelle";
      const seasonSlug = era === "retro" ? `retro-${label}` : label;
      return { seasonSlug, label, era };
    }
  }
  // Format court "YY/YY" ou "YY-YY" (ex "01/02", "90/92")
  const m2 = title.match(/\b(\d{2})[-/](\d{2})\b/);
  if (m2) {
    const y1 = parseInt(m2[1], 10);
    const y2 = parseInt(m2[2], 10);
    const fullY1 = y1 < 30 ? 2000 + y1 : 1900 + y1;
    const fullY2 = y2 < 30 ? 2000 + y2 : 1900 + y2;
    if (fullY2 > fullY1 && fullY2 - fullY1 <= 3) {
      const label = `${fullY1}-${fullY2}`;
      return { seasonSlug: `retro-${label}`, label, era: "retro" };
    }
  }
  // "Rétro 98" — année courte solo après le mot rétro
  const m3 = title.match(/r[ée]tro\s+(\d{2})\b/i);
  if (m3) {
    const y = parseInt(m3[1], 10);
    const fullY = y < 30 ? 2000 + y : 1900 + y;
    const label = `${fullY}-${fullY + 1}`;
    return { seasonSlug: `retro-${label}`, label, era: "retro" };
  }
  // Une seule année 4 chiffres (ex "1998")
  const single = title.match(/\b(19|20)(\d{2})\b/);
  if (single) {
    const yFull = parseInt(`${single[1]}${single[2]}`, 10);
    if (yFull < 2020) {
      const label = `${yFull}-${yFull + 1}`;
      return { seasonSlug: `retro-${label}`, label, era: "retro" };
    }
  }
  return null;
}

// --- Nettoyage du nom --------------------------------------------------------
function cleanName(raw: string): string {
  return raw
    .replace(/\s+/g, " ")
    .trim();
}

// --- Slugify ------------------------------------------------------------------
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// --- Génération description ---------------------------------------------------
function generateDescription(name: string, kind: Kind, gender: Gender, seasonLabel?: string) {
  const seasonStr = seasonLabel ? ` saison ${seasonLabel}` : "";
  const typeLabel: Record<Kind, string> = {
    domicile: "domicile",
    exterieur: "extérieur",
    third: "third",
    fourth: "fourth",
    concept: "concept",
    retro: "rétro",
    gardien: "gardien",
    training: "training",
    shorts: "short",
    "edition-speciale": "édition spéciale",
  };
  const tStr = typeLabel[kind];
  const genderLabel = gender === "enfant" ? "enfant" : gender === "femme" ? "femme" : "homme";

  const short = `${name}${seasonStr}. Maillot ${tStr} ${genderLabel}, floquage 100% personnalisable (n'importe quel nom et numéro), livraison rapide.`;

  const long = `${name}${seasonStr}.

Pièce ${tStr === "short" ? "indispensable" : "officielle"} pour tout supporter parisien. Confection en polyester respirant, technologie Dri-FIT (ou équivalent selon le modèle), coupe ${gender === "enfant" ? "enfant adaptée" : "adulte"} confortable.

Disponible ${gender === "enfant" ? "du 4 ans au 14 ans" : "du S au 3XL"}. **Floquage entièrement personnalisable** pour 5 € : nom et numéro de votre choix — joueur du PSG (Mbappé, Dembélé, Hakimi, Donnarumma, Marquinhos…), votre propre nom, le nom d'un proche, un surnom, un message, peu importe. Vous floquez ce que vous voulez.

Livraison soignée en France métropolitaine. Garantie satisfaction.`;
  return { short, long };
}

// --- Categories à créer si manquantes -----------------------------------------
const EXTRA_CATS: Array<{
  slug: string;
  name: string;
  position: number;
  description: string;
  longContent: string;
  metaTitle: string;
  metaDesc: string;
}> = [
  {
    slug: "concept",
    name: "Concept",
    position: 9,
    description:
      "Les maillots concept du PSG : créations exclusives non officielles, designs audacieux, pièces collectors prisées des supporters parisiens.",
    longContent: `Les maillots concept du Paris Saint-Germain sont des créations design imaginées par des artistes ou des labels indépendants, en dehors du catalogue officiel Nike. Ils s'inspirent de l'identité visuelle du club mais osent des coloris (rose, blanc cassé, noir intégral, or), des typographies et des codes graphiques qui sortent des sentiers battus. Pièces très prisées des collectionneurs et des fans qui veulent un maillot unique.

Toutes les tailles adulte (S à 3XL) sont disponibles, avec l'option floquage personnalisé de votre joueur préféré : Mbappé, Dembélé, Hakimi, Donnarumma, Marquinhos.`,
    metaTitle: "Maillot PSG Concept — Designs exclusifs et collectors",
    metaDesc:
      "Maillots concept PSG : designs exclusifs non officiels, coloris audacieux, pièces collectors. Floquage personnalisé inclus.",
  },
  {
    slug: "fourth",
    name: "Fourth",
    position: 10,
    description:
      "Le quatrième maillot du PSG : la pièce la plus rare et la plus collector. Édition limitée, design exceptionnel, souvent en collaboration Jordan.",
    longContent: `Le maillot fourth du PSG est la pièce la plus rare de la saison. Depuis le partenariat avec la marque Jordan, le PSG propose chaque année une 4ème tunique au design exceptionnel, souvent en édition limitée et au coloris audacieux : noir intégral, blanc cassé, rouge sang. Très recherché par les collectionneurs.

Disponible du S au 3XL avec floquage personnalisé Mbappé, Dembélé, Hakimi, Donnarumma, Marquinhos pour seulement 5 €.`,
    metaTitle: "Maillot PSG Fourth — Le 4ème maillot collector",
    metaDesc:
      "Maillot Fourth PSG : la pièce la plus rare et la plus collector. Édition limitée Jordan, floquage personnalisé.",
  },
  {
    slug: "shorts",
    name: "Shorts",
    position: 11,
    description:
      "Les shorts officiels du PSG pour compléter votre tenue : domicile, extérieur, third, gardien. Coupe ample, polyester respirant.",
    longContent: `Les shorts du Paris Saint-Germain complètent l'ensemble de votre tenue de match. Disponibles dans les coloris assortis aux maillots domicile (bleu marine ou blanc), extérieur, third et gardien (vert, jaune, noir), ils reprennent les codes graphiques de chaque saison.

Polyester respirant, coupe ample pour les mouvements, écusson PSG brodé sur la cuisse. Disponibles du S au 3XL et en tailles enfant. Idéal pour le foot en club, en cinq, ou pour porter au quotidien comme un supporter.`,
    metaTitle: "Short PSG — Domicile, Extérieur, Third, Gardien",
    metaDesc:
      "Shorts officiels du PSG : domicile, extérieur, third, gardien. Toutes les tailles, livraison rapide.",
  },
];

async function ensureCategories() {
  for (const c of EXTRA_CATS) {
    const exists = await prisma.category.findUnique({ where: { slug: c.slug } });
    if (!exists) {
      await prisma.category.create({ data: c });
      console.log(`+ catégorie créée : ${c.slug}`);
    }
  }
}

async function ensureSeason(info: SeasonInfo) {
  const existing = await prisma.season.findUnique({ where: { slug: info.seasonSlug } });
  if (existing) return existing;
  return prisma.season.create({
    data: {
      slug: info.seasonSlug,
      label: info.label,
      era: info.era,
      description:
        info.era === "retro"
          ? `Saison rétro ${info.label} du Paris Saint-Germain. Maillots vintages prisés des collectionneurs.`
          : `Saison ${info.label} du Paris Saint-Germain. Découvrez l'ensemble des maillots de cette saison.`,
    },
  });
}

// --- Main --------------------------------------------------------------------
async function main() {
  const json = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "scraped", "lmdm", "products.json"), "utf-8"),
  ) as ScrapedProduct[];

  // 1. Filtre PSG/Paris uniquement (exclusion : Paris FC, mystère, faux positifs LMDM)
  const BLACKLIST = new Set<string>([
    // Mauvais étiquetage LMDM : ces handles "Paris ... manches longues retro" sont en réalité du Real Madrid
    "paris-maillot-2017-2018-manches-longues-retro",
    "paris-maillot-2012-2013-manches-longues-retro",
  ]);
  const inScope = json.filter(
    (p) =>
      /\bpsg\b|\bparis\b/i.test(p.title) &&
      !/paris\s*fc/i.test(p.title) &&
      !/myst[èe]re|al[ée]atoire/i.test(p.title) &&
      !BLACKLIST.has(p.handle),
  );
  console.log(`Total scrapé : ${json.length} — PSG/Paris en scope : ${inScope.length}`);

  // 2. Catégories manquantes
  await ensureCategories();

  // 3. Cache catégories par slug
  const cats = await prisma.category.findMany();
  const catBySlug = new Map(cats.map((c) => [c.slug, c]));

  // 4. Boucle import
  let created = 0;
  let updated = 0;
  let skipped = 0;
  const skippedReasons: Record<string, number> = {};

  for (const p of inScope) {
    const name = cleanName(p.title);
    const kind = detectKind(name);
    const gender = detectGender(name);
    const catSlug = categorySlugFor(kind, gender);
    const cat = catBySlug.get(catSlug);
    if (!cat) {
      skipped++;
      skippedReasons[`cat:${catSlug}`] = (skippedReasons[`cat:${catSlug}`] || 0) + 1;
      continue;
    }

    const seasonInfo = detectSeason(name, kind);
    const season = seasonInfo ? await ensureSeason(seasonInfo) : null;

    const slug = slugify(p.handle);
    const imgDir = path.join(process.cwd(), "public", "images", "lmdm");
    const imageExt = ["jpg", "jpeg", "png", "webp"].find((ext) =>
      fs.existsSync(path.join(imgDir, `${p.handle}.${ext}`)),
    );
    if (!imageExt) {
      skipped++;
      skippedReasons["no-image"] = (skippedReasons["no-image"] || 0) + 1;
      continue;
    }
    const imageRel = `/images/lmdm/${p.handle}.${imageExt}`;

    // Règle de prix uniforme : 45 € pour les survêtements, 25 € pour le reste
    const isTracksuit = /surv[êe]tement/i.test(name);
    const price = isTracksuit ? 45 : 25;
    const oldPrice = null;
    const sizes = gender === "enfant" ? KID_SIZES : ADULT_SIZES;
    const { short, long } = generateDescription(name, kind, gender, season?.label);

    const existing = await prisma.product.findUnique({ where: { slug } });

    const baseData = {
      name,
      shortDescription: short,
      description: long,
      price,
      oldPrice,
      categoryId: cat.id,
      seasonId: season?.id,
      seasonLabel: season?.label,
      team: "PSG",
      kind,
      gender,
      flockingAvailable: true,
      flockingPrice: 5,
      featured: true,
      active: true,
      stock: 50,
      metaTitle: `${name} — La Maison du Maillot`.slice(0, 60),
      metaDesc: short.slice(0, 160),
    };

    if (existing) {
      await prisma.product.update({
        where: { slug },
        data: {
          ...baseData,
          images: {
            deleteMany: {},
            create: [{ url: imageRel, alt: name, position: 0 }],
          },
          sizes: {
            deleteMany: {},
            create: sizes.map((s) => ({ ...s, stock: 50 })),
          },
        },
      });
      updated++;
    } else {
      await prisma.product.create({
        data: {
          slug,
          ...baseData,
          images: { create: [{ url: imageRel, alt: name, position: 0 }] },
          sizes: { create: sizes.map((s) => ({ ...s, stock: 50 })) },
        },
      });
      created++;
    }
  }

  console.log(`\n✅ Import terminé`);
  console.log(`   créés    : ${created}`);
  console.log(`   mis à jour : ${updated}`);
  console.log(`   ignorés  : ${skipped}`);
  if (skipped > 0) console.log("   raisons :", skippedReasons);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
