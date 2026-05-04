import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tous les maillots PSG. Collection complète.",
  description:
    "Découvrez l'intégralité de notre catalogue de maillots du Paris Saint-Germain : domicile, extérieur, third, gardien, training, rétro, homme, femme et enfant. Floquage personnalisé.",
  alternates: { canonical: "/maillots" },
};

export default async function AllProducts() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true },
      orderBy: [{ seasonLabel: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
    }),
    prisma.category.findMany({ orderBy: { position: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Accueil", url: "/" },
              { name: "Maillots", url: "/maillots" },
            ]),
          ),
        }}
      />
      <nav className="text-sm text-neutral-500 mb-3">
        <Link href="/">Accueil</Link> <span className="mx-1">/</span> <span>Maillots</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-black">Tous les maillots du PSG</h1>
      <p className="text-neutral-600 mt-2 max-w-2xl">
        Parcourez l&apos;ensemble de notre collection de maillots du Paris Saint-Germain&nbsp;:
        toutes les saisons, toutes les tailles, et le floquage personnalisé en option (5 €).
      </p>

      {categories.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/maillots/${c.slug}`}
              className="px-4 py-1.5 rounded-full border border-neutral-200 text-sm hover:border-psg-blue hover:text-psg-blue"
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <div className="mt-10 rounded-2xl border-2 border-dashed border-neutral-300 p-10 text-center bg-neutral-50">
          <p className="text-neutral-600">Aucun maillot pour le moment. Ajoutez vos produits depuis l&apos;administration.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
