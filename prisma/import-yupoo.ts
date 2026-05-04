import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter, log: ["error"] });

const SUPPLIER_BASE = "https://12345-67890.x.yupoo.com/";

type YupooImage = { hash: string; ext?: "jpg" | "png" };
type ImportItem = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  oldPrice?: number;
  categorySlug: string;
  seasonSlug?: string;
  kind: string;
  gender: "homme" | "femme" | "enfant";
  featured?: boolean;
  metaTitle?: string;
  metaDesc?: string;
  sizes: { label: string; kind: "adulte" | "enfant" }[];
  images: YupooImage[];
};

const ADULT_SIZES_DEFAULT = ["S", "M", "L", "XL", "XXL", "3XL"].map((label) => ({ label, kind: "adulte" as const }));
const KID_SIZES_DEFAULT = [
  "2-3 ans",
  "3-4 ans",
  "4-5 ans",
  "6-7 ans",
  "8-9 ans",
  "10-11 ans",
  "12-13 ans",
].map((label) => ({ label, kind: "enfant" as const }));

const ITEMS: ImportItem[] = [
  {
    slug: "psg-domicile-2025-2026-player",
    name: "Maillot PSG Domicile 2025-2026 (Player Version)",
    shortDescription: "Maillot domicile officiel du PSG saison 2025-2026, version player ajustée portée par les joueurs en match.",
    description: `Le maillot domicile du Paris Saint-Germain pour la saison 2025-2026 en version Player, identique à celui porté par l'effectif sur la pelouse du Parc des Princes. Coupe ajustée, technologie respirante, finitions premium.

Disponible du S au 3XL. Floquage personnalisé en typographie officielle Ligue 1 ou UEFA Champions League : 5 € seulement.`,
    price: 29,
    categorySlug: "domicile",
    seasonSlug: "2025-2026",
    kind: "domicile",
    gender: "homme",
    featured: true,
    metaTitle: "Maillot PSG Domicile 2025-2026 Player Version. Floquage 5 €.",
    metaDesc: "Maillot domicile PSG saison 2025-2026 version Player. Tailles S à 3XL, floquage personnalisé 5 €. Livraison 9 à 12 jours ouvrés.",
    sizes: ADULT_SIZES_DEFAULT,
    images: [
      { hash: "6f895958" },
      { hash: "e0311c8a" },
      { hash: "fa2e94f1" },
      { hash: "56b681fa" },
      { hash: "26b58ea8" },
      { hash: "58221f40" },
      { hash: "ed9cc631" },
      { hash: "c81e7504" },
      { hash: "0166d6ce" },
    ],
  },
  {
    slug: "psg-domicile-2025-2026-enfant",
    name: "Maillot PSG Domicile 2025-2026 Enfant",
    shortDescription: "Le maillot domicile du PSG saison 2025-2026 en taille enfant, du 2 au 13 ans.",
    description: `Le maillot domicile officiel du Paris Saint-Germain saison 2025-2026 en coupe enfant. Idéal cadeau d'anniversaire ou de Noël pour les jeunes supporters parisiens.

Disponible du 2-3 ans (XXS / 16) au 12-13 ans (XXL / 28). Floquage personnalisé du joueur préféré inclus pour 5 €.`,
    price: 29.9,
    categorySlug: "enfant",
    seasonSlug: "2025-2026",
    kind: "domicile",
    gender: "enfant",
    featured: true,
    metaTitle: "Maillot PSG Domicile Enfant 2025-2026. Floquage personnalisé.",
    metaDesc: "Maillot PSG enfant saison 2025-2026 domicile. Tailles 2 à 13 ans, floquage personnalisé 5 €. Livraison 9 à 12 jours ouvrés.",
    sizes: KID_SIZES_DEFAULT,
    images: [
      { hash: "84454b76" },
      { hash: "06dc28b8" },
      { hash: "35f57025" },
      { hash: "ed85e5f7" },
      { hash: "a0d8ce3b" },
      { hash: "ef4e2bc9" },
      { hash: "51ed675c" },
      { hash: "0ac6b683" },
      { hash: "8f66b092" },
    ],
  },
  {
    slug: "psg-edition-speciale-2025-2026-noir",
    name: "Maillot PSG Édition Spéciale Noir 2025-2026",
    shortDescription: "Édition spéciale noire du maillot PSG 2025-2026, design exclusif tirage limité.",
    description: `Édition spéciale du maillot PSG pour la saison 2025-2026 en coloris noir intégral. Pièce collector au design exclusif, parfaite pour se démarquer.

Disponible du S au 3XL. Floquage personnalisé en typographie officielle disponible pour 5 €.`,
    price: 25,
    categorySlug: "edition-speciale",
    seasonSlug: "2025-2026",
    kind: "edition-speciale",
    gender: "homme",
    metaTitle: "Maillot PSG Édition Spéciale Noir 2025-2026.",
    metaDesc: "Édition spéciale noire du maillot PSG saison 2025-2026. Tailles S à 3XL, floquage 5 €. Pièce collector.",
    sizes: ADULT_SIZES_DEFAULT,
    images: [
      { hash: "fc60e63f", ext: "png" },
      { hash: "dacefe65", ext: "png" },
    ],
  },
];

function downloadImage(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(
        url,
        {
          headers: {
            Referer: SUPPLIER_BASE,
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36",
          },
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            file.close();
            fs.unlinkSync(dest);
            return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
          }
          if (res.statusCode !== 200) {
            file.close();
            fs.unlinkSync(dest);
            return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          }
          res.pipe(file);
          file.on("finish", () => file.close((err) => (err ? reject(err) : resolve())));
        },
      )
      .on("error", (err) => {
        file.close();
        try {
          fs.unlinkSync(dest);
        } catch {}
        reject(err);
      });
  });
}

async function importItem(item: ImportItem) {
  const cat = await prisma.category.findUnique({ where: { slug: item.categorySlug } });
  if (!cat) throw new Error(`Catégorie "${item.categorySlug}" introuvable. Lance d'abord npm run db:seed.`);

  const season = item.seasonSlug
    ? await prisma.season.findUnique({ where: { slug: item.seasonSlug } })
    : null;

  const dir = path.join(process.cwd(), "public", "uploads", "yupoo", item.slug);
  fs.mkdirSync(dir, { recursive: true });

  const imageFiles: { url: string; alt: string; position: number }[] = [];

  for (let i = 0; i < item.images.length; i++) {
    const img = item.images[i];
    const ext = img.ext ?? "jpg";
    const filename = `${String(i + 1).padStart(2, "0")}.${ext}`;
    const dest = path.join(dir, filename);
    const remote = `https://photo.yupoo.com/12345-67890/${img.hash}/large.${ext}`;

    if (!fs.existsSync(dest) || fs.statSync(dest).size < 5000) {
      process.stdout.write(`  ↓ ${item.slug}/${filename}… `);
      try {
        await downloadImage(remote, dest);
        process.stdout.write(`OK (${(fs.statSync(dest).size / 1024).toFixed(0)} Ko)\n`);
      } catch (err) {
        process.stdout.write(`ERR: ${(err as Error).message}\n`);
        continue;
      }
    } else {
      console.log(`  ✓ ${item.slug}/${filename} (déjà présent)`);
    }

    imageFiles.push({
      url: `/uploads/yupoo/${item.slug}/${filename}`,
      alt: `${item.name} – photo ${i + 1}`,
      position: i,
    });
  }

  await prisma.product.upsert({
    where: { slug: item.slug },
    update: {
      name: item.name,
      shortDescription: item.shortDescription,
      description: item.description,
      price: item.price,
      oldPrice: item.oldPrice,
      categoryId: cat.id,
      seasonId: season?.id,
      seasonLabel: season?.label,
      team: "PSG",
      kind: item.kind,
      gender: item.gender,
      flockingAvailable: true,
      flockingPrice: 5,
      featured: item.featured ?? false,
      active: true,
      metaTitle: item.metaTitle,
      metaDesc: item.metaDesc,
      images: {
        deleteMany: {},
        create: imageFiles,
      },
      sizes: {
        deleteMany: {},
        create: item.sizes.map((s, idx) => ({
          label: s.label,
          kind: s.kind,
          stock: 50,
          position: idx,
        })),
      },
    },
    create: {
      slug: item.slug,
      name: item.name,
      shortDescription: item.shortDescription,
      description: item.description,
      price: item.price,
      oldPrice: item.oldPrice,
      categoryId: cat.id,
      seasonId: season?.id,
      seasonLabel: season?.label,
      team: "PSG",
      kind: item.kind,
      gender: item.gender,
      flockingAvailable: true,
      flockingPrice: 5,
      featured: item.featured ?? false,
      active: true,
      stock: 100,
      metaTitle: item.metaTitle,
      metaDesc: item.metaDesc,
      images: { create: imageFiles },
      sizes: {
        create: item.sizes.map((s, idx) => ({
          label: s.label,
          kind: s.kind,
          stock: 50,
          position: idx,
        })),
      },
    },
  });

  console.log(`✔ ${item.slug} (${imageFiles.length} images)`);
}

async function main() {
  for (const item of ITEMS) {
    console.log(`\n→ ${item.name}`);
    await importItem(item);
  }
  console.log(`\n✅ ${ITEMS.length} produits importés.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
