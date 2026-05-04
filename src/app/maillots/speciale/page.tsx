import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";

const MAIN_CATS = ["domicile", "exterieur", "third", "enfant", "retro"];

export const metadata: Metadata = {
  title: "Maillot PSG Spéciale — Concept, Fourth, Gardien, Training, Édition limitée",
  description:
    "Toute la sélection des maillots PSG hors collections principales : maillots concept, fourth, gardien Donnarumma, training, shorts et éditions spéciales collector. Floquage personnalisable (5 €).",
  alternates: { canonical: "/maillots/speciale" },
  openGraph: {
    title: "Maillot PSG Spéciale — Concept, Fourth, Training, Éditions limitées",
    description:
      "Maillots PSG hors catégories principales : concept, fourth, gardien, training, shorts, éditions spéciales. Pièces collectors et créations exclusives.",
    url: "/maillots/speciale",
  },
};

export default async function SpecialePage() {
  const products = await prisma.product.findMany({
    where: {
      active: true,
      category: { slug: { notIn: MAIN_CATS } },
    },
    include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true },
    orderBy: [{ seasonLabel: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
  });

  // Regrouper par catégorie pour structurer la page
  const byCategory = new Map<string, typeof products>();
  for (const p of products) {
    const arr = byCategory.get(p.category.slug) ?? [];
    arr.push(p);
    byCategory.set(p.category.slug, arr);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([
              { name: "Accueil", url: "/" },
              { name: "Maillots", url: "/maillots" },
              { name: "Spéciale", url: "/maillots/speciale" },
            ]),
            itemListJsonLd(
              products.map((p) => ({
                name: p.name,
                url: `/produit/${p.slug}`,
                image: p.images[0]?.url,
              })),
              "Maillots PSG Spéciale",
            ),
          ]),
        }}
      />

      <nav className="text-sm text-neutral-500 mb-3">
        <Link href="/">Accueil</Link> <span className="mx-1">/</span>{" "}
        <Link href="/maillots">Maillots</Link> <span className="mx-1">/</span>{" "}
        <span>Spéciale</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-black">Maillot PSG Spéciale</h1>
      <p className="text-neutral-700 mt-3 max-w-3xl">
        Toutes les pièces qui sortent du cadre des collections principales : maillots concept aux designs audacieux,
        fourth en édition Jordan, training porté à Poissy, gardien de Donnarumma, shorts et éditions
        limitées collectors. Floquage entièrement personnalisable (5 €).
      </p>

      {products.length === 0 ? (
        <div className="mt-10 rounded-2xl border-2 border-dashed border-neutral-300 p-10 text-center bg-neutral-50">
          <p className="text-neutral-600">Aucun maillot dans cette sélection pour l&apos;instant.</p>
        </div>
      ) : (
        <div className="mt-10 space-y-14">
          {[...byCategory.entries()].map(([slug, items]) => {
            const catName = items[0].category.name;
            return (
              <section key={slug}>
                <div className="flex items-end justify-between gap-4 border-b border-neutral-200 pb-3">
                  <h2 className="text-2xl font-black tracking-tight">{catName}</h2>
                  <Link
                    href={`/maillots/${slug}`}
                    className="text-sm font-semibold text-psg-blue hover:text-psg-red whitespace-nowrap"
                  >
                    Voir la catégorie →
                  </Link>
                </div>
                <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {items.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
