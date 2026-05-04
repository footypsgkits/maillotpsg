import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = await prisma.category.findUnique({ where: { slug: category } });
  if (!cat) {
    return { title: "Catégorie introuvable", robots: { index: false, follow: false } };
  }
  const title = cat.metaTitle ?? `Maillot PSG ${cat.name}. Toutes les saisons et tailles.`;
  const description =
    cat.metaDesc ??
    cat.description ??
    `Tous les maillots PSG ${cat.name.toLowerCase()} disponibles. Tailles S à 3XL, enfant 2 à 13 ans, floquage personnalisé Mbappé, Dembélé, Hakimi en option (5 €). Livraison 9 à 12 jours ouvrés.`;
  return {
    title,
    description,
    alternates: { canonical: `/maillots/${cat.slug}` },
    openGraph: { title, description, url: `/maillots/${cat.slug}` },
  };
}

export async function generateStaticParams() {
  const cats = await prisma.category.findMany({ select: { slug: true } });
  return cats.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = await prisma.category.findUnique({
    where: { slug: category },
    include: {
      products: {
        where: { active: true },
        include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true },
        orderBy: [{ seasonLabel: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
      },
    },
  });
  if (!cat) notFound();

  const players = await prisma.player.findMany({
    where: { active: true, era: "actuel" },
    orderBy: { position2: "asc" },
    take: 8,
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
              { name: "Maillots", url: "/maillots" },
              { name: cat.name, url: `/maillots/${cat.slug}` },
            ]),
            itemListJsonLd(
              cat.products.map((p) => ({
                name: p.name,
                url: `/produit/${p.slug}`,
                image: p.images[0]?.url,
              })),
              `Maillots PSG ${cat.name}`,
            ),
          ]),
        }}
      />
      <nav className="text-sm text-neutral-500 mb-3">
        <Link href="/">Accueil</Link> <span className="mx-1">/</span>{" "}
        <Link href="/maillots">Maillots</Link> <span className="mx-1">/</span>{" "}
        <span>{cat.name}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-black">Maillot PSG {cat.name}</h1>
      {cat.description && (
        <p className="text-neutral-700 mt-3 max-w-3xl">{cat.description}</p>
      )}

      {cat.products.length === 0 ? (
        <div className="mt-10 rounded-2xl border-2 border-dashed border-neutral-300 p-10 text-center bg-neutral-50">
          <p className="text-neutral-600">Aucun maillot dans cette catégorie pour l&apos;instant.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {cat.products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Internal linking : joueurs à floquer */}
      {players.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold">Floquer un joueur sur votre maillot {cat.name.toLowerCase()}</h2>
          <p className="text-neutral-600 mt-2">
            Tous les maillots PSG {cat.name.toLowerCase()} sont floquables au nom du joueur de votre choix&nbsp;:
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {players.map((p) => (
              <Link
                key={p.id}
                href={`/joueur/${p.slug}`}
                className="px-3 py-1.5 rounded-full border border-neutral-200 bg-white hover:border-psg-blue text-sm"
              >
                Maillot {p.name} {p.number != null ? `#${p.number}` : ""}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bloc SEO long */}
      {cat.longContent && (
        <article className="prose prose-neutral max-w-3xl mt-14 whitespace-pre-line">
          <h2 className="text-2xl font-black">À propos du maillot PSG {cat.name}</h2>
          <p>{cat.longContent}</p>
        </article>
      )}
    </div>
  );
}
