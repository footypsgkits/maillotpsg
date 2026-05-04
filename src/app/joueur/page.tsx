import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Maillots PSG par joueur : Mbappé, Dembélé, Hakimi, Donnarumma…",
  description:
    "Achetez votre maillot PSG floqué au nom du joueur de votre choix. Mbappé, Ousmane Dembélé, Achraf Hakimi, Marquinhos, Donnarumma, Vitinha, Barcola, Kvaratskhelia, Désiré Doué, João Neves : effectif 2025-2026 et légendes du Paris Saint-Germain.",
  alternates: { canonical: "/joueur" },
  keywords: [
    "maillot PSG joueur",
    "maillot Mbappé PSG",
    "maillot Dembélé PSG",
    "maillot Hakimi PSG",
    "maillot Donnarumma",
    "maillot Marquinhos",
    "maillot Vitinha",
    "maillot Barcola",
    "maillot Kvaratskhelia",
    "maillot Désiré Doué",
  ],
};

export default async function PlayersIndex() {
  const players = await prisma.player.findMany({
    where: { active: true },
    orderBy: [{ era: "asc" }, { position2: "asc" }, { name: "asc" }],
  });
  const current = players.filter((p) => p.era === "actuel");
  const legends = players.filter((p) => p.era === "legende");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([
              { name: "Accueil", url: "/" },
              { name: "Joueurs", url: "/joueur" },
            ]),
            itemListJsonLd(
              players.map((p) => ({
                name: `Maillot PSG ${p.name}`,
                url: `/joueur/${p.slug}`,
                image: p.imageUrl ?? undefined,
              })),
              "Maillots PSG par joueur",
            ),
          ]),
        }}
      />
      <nav className="text-sm text-neutral-500 mb-3">
        <Link href="/">Accueil</Link> <span className="mx-1">/</span> <span>Joueurs</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-black">Maillot PSG par joueur</h1>
      <p className="text-neutral-700 mt-3 max-w-3xl">
        Choisissez le maillot du Paris Saint-Germain au nom de votre joueur préféré.
        Tous nos maillots sont floquables au dos en typographie officielle Ligue 1 et
        UEFA Champions League selon la saison. Effectif 2025-2026 complet et légendes du club.
      </p>

      {current.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-5">Effectif 2025-2026</h2>
          <PlayerGrid players={current} />
        </section>
      )}

      {legends.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-5">Légendes du PSG</h2>
          <PlayerGrid players={legends} />
        </section>
      )}

      {players.length === 0 && (
        <div className="mt-10 rounded-2xl border-2 border-dashed border-neutral-300 p-10 text-center bg-neutral-50">
          <p className="text-neutral-600">Les pages joueurs arrivent très bientôt.</p>
        </div>
      )}
    </div>
  );
}

function PlayerGrid({
  players,
}: {
  players: { id: string; name: string; slug: string; number: number | null; position: string | null; imageUrl: string | null }[];
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {players.map((p) => (
        <Link
          key={p.id}
          href={`/joueur/${p.slug}`}
          className="group rounded-2xl bg-white border border-neutral-200 hover:border-psg-blue hover:shadow-lg transition overflow-hidden"
        >
          <div className="aspect-square bg-gradient-to-br from-psg-blue to-psg-dark relative">
            {p.imageUrl ? (
              <Image
                src={p.imageUrl}
                alt={`Maillot PSG ${p.name}${p.number != null ? ` n°${p.number}` : ""}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
                {...(p.imageUrl.startsWith("http") ? { unoptimized: true } : {})}
              />
            ) : (
              <div className="w-full h-full grid place-items-center">
                <span className="text-white/40 font-black text-7xl">{p.number ?? "?"}</span>
              </div>
            )}
            {p.number != null && (
              <span className="absolute top-3 right-3 bg-psg-red text-white font-bold px-2 py-1 rounded text-sm">
                #{p.number}
              </span>
            )}
          </div>
          <div className="p-4">
            <div className="font-semibold group-hover:text-psg-blue">{p.name}</div>
            {p.position && <div className="text-xs text-neutral-500 mt-0.5">{p.position}</div>}
          </div>
        </Link>
      ))}
    </div>
  );
}
