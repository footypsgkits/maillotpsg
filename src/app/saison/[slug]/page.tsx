import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const seasons = await prisma.season.findMany({ where: { active: true }, select: { slug: true } });
  return seasons.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = await prisma.season.findUnique({ where: { slug } });
  if (!s) return { title: "Saison introuvable", robots: { index: false } };
  const title = s.metaTitle ?? `Maillot PSG ${s.label} : domicile, extérieur, third`;
  const description =
    s.metaDesc ??
    `Découvrez l'intégralité des maillots du Paris Saint-Germain pour la saison ${s.label}. Domicile, extérieur, third et déclinaisons enfant. Floquage personnalisé en option (5 €), livraison 9 à 12 jours ouvrés.`;
  return {
    title,
    description,
    alternates: { canonical: `/saison/${s.slug}` },
    openGraph: { title, description, url: `/saison/${s.slug}` },
    keywords: [`maillot PSG ${s.label}`, `maillot psg ${s.label.replace("-", " ")}`],
  };
}

export default async function SeasonPage({ params }: Props) {
  const { slug } = await params;
  const season = await prisma.season.findUnique({
    where: { slug },
    include: {
      products: {
        where: { active: true },
        include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!season || !season.active) notFound();

  // Fallback: si pas de produits liés, chercher par seasonLabel
  const products = season.products.length > 0
    ? season.products
    : await prisma.product.findMany({
        where: { active: true, seasonLabel: season.label },
        include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true },
        orderBy: { createdAt: "desc" },
      });

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
              { name: season.label, url: `/saison/${season.slug}` },
            ]),
            itemListJsonLd(
              products.map((p) => ({
                name: p.name,
                url: `/produit/${p.slug}`,
                image: p.images[0]?.url,
              })),
              `Maillots PSG ${season.label}`,
            ),
          ]),
        }}
      />
      <nav className="text-sm text-neutral-500 mb-3">
        <Link href="/">Accueil</Link> <span className="mx-1">/</span>{" "}
        <Link href="/saison">Saisons</Link> <span className="mx-1">/</span>{" "}
        <span>{season.label}</span>
      </nav>
      <header className="mb-8">
        <div className="text-xs uppercase tracking-wider text-psg-red font-bold">
          {season.era === "retro" ? "Saison rétro" : `Saison ${season.label}`}
        </div>
        <h1 className="text-3xl md:text-5xl font-black mt-1">Maillot PSG {season.label}</h1>
      </header>

      <article className="prose prose-neutral max-w-3xl whitespace-pre-line">
        {season.description}
      </article>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Tous les maillots de la saison {season.label}</h2>
        {products.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border-2 border-dashed border-neutral-300 p-10 text-center bg-neutral-50">
            <p className="text-neutral-600">
              Maillots de la saison {season.label} bientôt disponibles.{" "}
              <Link href="/maillots" className="text-psg-blue underline">Voir tous les maillots</Link>
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
