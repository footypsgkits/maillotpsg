import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Maillots PSG par saison : toutes les saisons du Paris Saint-Germain",
  description:
    "Toutes les saisons du PSG, de la collection 2025-2026 aux maillots rétro et vintage. Historique complet des maillots du Paris Saint-Germain.",
  alternates: { canonical: "/saison" },
  keywords: [
    "maillot PSG saison",
    "maillot PSG 2025 2026",
    "maillot PSG 2024 2025",
    "maillot PSG 2023 2024",
    "maillot PSG vintage",
    "maillot PSG historique",
  ],
};

export default async function SeasonsIndex() {
  const seasons = await prisma.season.findMany({
    where: { active: true },
    orderBy: [{ era: "asc" }, { position: "asc" }],
  });
  const groups = {
    actuelle: seasons.filter((s) => s.era === "actuelle"),
    recente: seasons.filter((s) => s.era === "recente"),
    retro: seasons.filter((s) => s.era === "retro"),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([
              { name: "Accueil", url: "/" },
              { name: "Saisons", url: "/saison" },
            ]),
            itemListJsonLd(
              seasons.map((s) => ({
                name: `Maillot PSG ${s.label}`,
                url: `/saison/${s.slug}`,
                image: s.imageUrl ?? undefined,
              })),
              "Maillots PSG par saison",
            ),
          ]),
        }}
      />
      <nav className="text-sm text-neutral-500 mb-3">
        <Link href="/">Accueil</Link> <span className="mx-1">/</span> <span>Saisons</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-black">Maillot PSG par saison</h1>
      <p className="text-neutral-700 mt-3 max-w-3xl">
        Plongez dans l&apos;histoire du Paris Saint-Germain saison par saison.
        De la collection actuelle 2025-2026 aux maillots vintage des années 1990,
        retrouvez l&apos;ensemble des tuniques portées par le club parisien.
      </p>

      {Object.entries({
        "Saison actuelle": groups.actuelle,
        "Saisons récentes": groups.recente,
        "Maillots rétro & vintage": groups.retro,
      }).map(([title, list]) =>
        list.length > 0 ? (
          <section key={title} className="mt-10">
            <h2 className="text-2xl font-bold mb-5">{title}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((s) => (
                <Link
                  key={s.id}
                  href={`/saison/${s.slug}`}
                  className="group rounded-2xl bg-white border border-neutral-200 hover:border-psg-blue hover:shadow-lg p-5 transition"
                >
                  <div className="text-xs uppercase tracking-wider text-psg-red font-bold">
                    Saison {s.label}
                  </div>
                  <div className="text-xl font-bold mt-1 group-hover:text-psg-blue">
                    Maillot PSG {s.label}
                  </div>
                  <p className="text-sm text-neutral-600 mt-2 line-clamp-3">{s.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null,
      )}

      {seasons.length === 0 && (
        <div className="mt-10 rounded-2xl border-2 border-dashed border-neutral-300 p-10 text-center bg-neutral-50">
          <p className="text-neutral-600">Les pages saisons arrivent très bientôt.</p>
        </div>
      )}
    </div>
  );
}
