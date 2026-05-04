import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Guides Maillots PSG : tailles, floquage, authentique vs replica…",
  description:
    "Tous nos guides pour bien choisir son maillot PSG : guide des tailles, options de floquage, différence maillot authentique et replica, histoire des maillots iconiques du Paris Saint-Germain.",
  alternates: { canonical: "/guide" },
};

export default async function GuidesIndex() {
  const guides = await prisma.guide.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([
              { name: "Accueil", url: "/" },
              { name: "Guides", url: "/guide" },
            ]),
            itemListJsonLd(
              guides.map((g) => ({
                name: g.title,
                url: `/guide/${g.slug}`,
                image: g.imageUrl ?? undefined,
              })),
              "Guides maillots PSG",
            ),
          ]),
        }}
      />
      <nav className="text-sm text-neutral-500 mb-3">
        <Link href="/">Accueil</Link> <span className="mx-1">/</span> <span>Guides</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-black">Guides &amp; conseils maillots PSG</h1>
      <p className="text-neutral-700 mt-3">
        Conseils pour bien choisir son maillot PSG, options de floquage, différences entre maillot
        authentique et replica, tour d&apos;horizon des maillots iconiques du Paris Saint-Germain :
        nos articles couvrent toutes les questions que se posent les supporters.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 gap-5">
        {guides.map((g) => (
          <Link
            key={g.id}
            href={`/guide/${g.slug}`}
            className="group rounded-2xl bg-white border border-neutral-200 hover:border-psg-blue hover:shadow-lg p-6 transition"
          >
            <h2 className="text-xl font-bold group-hover:text-psg-blue">{g.title}</h2>
            <p className="text-neutral-600 mt-2">{g.excerpt}</p>
            <span className="text-sm text-psg-blue mt-3 inline-block">Lire le guide →</span>
          </Link>
        ))}
        {guides.length === 0 && (
          <div className="col-span-full rounded-2xl border-2 border-dashed border-neutral-300 p-10 text-center bg-neutral-50">
            <p className="text-neutral-600">Premiers guides en cours de rédaction.</p>
          </div>
        )}
      </div>
    </div>
  );
}
