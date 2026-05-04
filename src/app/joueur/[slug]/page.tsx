import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { FeaturedGrid } from "@/components/FeaturedGrid";
import { breadcrumbJsonLd, faqJsonLd, personJsonLd, absUrl } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const players = await prisma.player.findMany({ where: { active: true }, select: { slug: true } });
  return players.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await prisma.player.findUnique({ where: { slug } });
  if (!p) return { title: "Joueur introuvable", robots: { index: false } };
  const title = p.metaTitle ?? `Maillot PSG ${p.name}${p.number ? ` n°${p.number}` : ""}. Floquage personnalisé.`;
  const description =
    p.metaDesc ??
    `Achetez votre maillot du PSG floqué ${p.name}${p.number ? ` (n°${p.number})` : ""}. Domicile, extérieur, third et collections enfant. Floquage personnalisé (5 €) en typographie Ligue 1 ou Champions League, livraison 9 à 12 jours ouvrés.`;
  return {
    title,
    description,
    alternates: { canonical: `/joueur/${p.slug}` },
    openGraph: {
      title,
      description,
      url: `/joueur/${p.slug}`,
      images: p.imageUrl ? [absUrl(p.imageUrl)] : undefined,
    },
    keywords: [
      `maillot PSG ${p.name}`,
      `maillot ${p.name} PSG`,
      `flocage ${p.name}`,
      `maillot ${p.name}`,
      ...(p.lastName ? [`maillot ${p.lastName}`, `maillot PSG ${p.lastName}`] : []),
    ],
  };
}

export default async function PlayerPage({ params }: Props) {
  const { slug } = await params;
  const player = await prisma.player.findUnique({ where: { slug } });
  if (!player || !player.active) notFound();

  // Tous les maillots floquables du site — chaque maillot peut être floqué au nom du joueur
  const products = await prisma.product.findMany({
    where: { active: true, flockingAvailable: true },
    include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true },
    orderBy: [{ seasonLabel: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
  });

  const faqs = [
    {
      q: `Quel est le numéro de ${player.name} au PSG ?`,
      a: player.number != null
        ? `${player.name} porte le numéro ${player.number} au Paris Saint-Germain.`
        : `Retrouvez le numéro actuel de ${player.name} sur la fiche officielle de l'effectif.`,
    },
    {
      q: `Comment floquer mon maillot PSG au nom de ${player.name} ?`,
      a: `Sélectionnez le maillot PSG de votre choix (domicile, extérieur, third…), choisissez votre taille, cochez l'option « Floquage personnalisé », saisissez « ${player.lastName ?? player.name} » comme nom${player.number != null ? ` et « ${player.number} » comme numéro` : ""}, puis ajoutez au panier. Le floquage est appliqué en typographie officielle.`,
    },
    {
      q: `Le maillot ${player.name} est-il disponible en taille enfant ?`,
      a: `Oui. Tous nos maillots PSG sont disponibles en tailles enfant de 2 à 13 ans, avec floquage personnalisé à votre choix. Idéal cadeau pour un jeune supporter.`,
    },
    {
      q: `Quel maillot ${player.name} choisir ?`,
      a: `Le maillot domicile reste le choix favori des supporters parisiens car c'est celui porté au Parc des Princes. Pour un look plus original, le maillot third ou fourth est très prisé. Tous se floquent au nom de ${player.name}.`,
    },
  ];

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
              { name: player.name, url: `/joueur/${player.slug}` },
            ]),
            personJsonLd(player),
            faqJsonLd(faqs),
          ]),
        }}
      />
      <nav className="text-sm text-neutral-500 mb-3">
        <Link href="/">Accueil</Link> <span className="mx-1">/</span>{" "}
        <Link href="/joueur">Joueurs</Link> <span className="mx-1">/</span>{" "}
        <span>{player.name}</span>
      </nav>

      <header className="grid md:grid-cols-[300px_1fr] gap-8 items-start">
        <div className="aspect-square rounded-2xl bg-gradient-to-br from-psg-blue to-psg-dark overflow-hidden relative">
          {player.imageUrl ? (
            <Image
              src={player.imageUrl}
              alt={`${player.name}${player.number != null ? ` n°${player.number}` : ""} – PSG`}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover"
              priority
              {...(player.imageUrl.startsWith("http") ? { unoptimized: true } : {})}
            />
          ) : (
            <div className="w-full h-full grid place-items-center">
              <span className="text-white/30 font-black text-9xl">{player.number ?? "?"}</span>
            </div>
          )}
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-psg-red font-bold">
            {player.era === "legende" ? "Légende du PSG" : "Effectif 2025-2026"}
          </div>
          <h1 className="text-3xl md:text-5xl font-black mt-1">
            Maillot PSG {player.name}
          </h1>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            {player.number != null && (
              <span className="bg-psg-red text-white font-bold px-2.5 py-1 rounded">N° {player.number}</span>
            )}
            {player.position && (
              <span className="bg-neutral-100 px-2.5 py-1 rounded">{player.position}</span>
            )}
            {player.nationality && (
              <span className="bg-neutral-100 px-2.5 py-1 rounded">{player.nationality}</span>
            )}
          </div>
          <article className="prose prose-neutral mt-5 whitespace-pre-line max-w-none">
            {player.bio}
          </article>
        </div>
      </header>

      <section className="mt-12">
        <h2 className="text-2xl md:text-3xl font-bold">
          Maillots PSG floquables {player.lastName ?? player.name}
        </h2>
        <p className="text-neutral-600 mt-2 max-w-3xl">
          Tous nos maillots du Paris Saint-Germain peuvent être floqués au nom de {player.name}
          {player.number != null ? ` (n°${player.number})` : ""}. Sélectionnez votre modèle, votre taille,
          puis activez l&apos;option floquage au panier.
        </p>
        {products.length > 0 ? (
          <FeaturedGrid products={products} />
        ) : (
          <div className="mt-6 rounded-2xl border-2 border-dashed border-neutral-300 p-10 text-center bg-neutral-50">
            <p className="text-neutral-600">
              Maillots floquables {player.name} bientôt disponibles.{" "}
              <Link href="/maillots" className="text-psg-blue underline">Voir tous les maillots</Link>
            </p>
          </div>
        )}
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-bold">Questions fréquentes</h2>
        <div className="mt-5 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="rounded-xl border border-neutral-200 bg-white p-4">
              <summary className="font-semibold cursor-pointer">{f.q}</summary>
              <p className="text-neutral-700 mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <RelatedPlayers currentSlug={player.slug} />
    </div>
  );
}

async function RelatedPlayers({ currentSlug }: { currentSlug: string }) {
  const others = await prisma.player.findMany({
    where: { active: true, era: "actuel", slug: { not: currentSlug } },
    take: 6,
    orderBy: { position2: "asc" },
  });
  if (others.length === 0) return null;
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-5">Autres joueurs du PSG</h2>
      <div className="flex flex-wrap gap-2">
        {others.map((p) => (
          <Link
            key={p.id}
            href={`/joueur/${p.slug}`}
            className="px-4 py-1.5 rounded-full border border-neutral-200 text-sm hover:border-psg-blue hover:text-psg-blue"
          >
            Maillot {p.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
