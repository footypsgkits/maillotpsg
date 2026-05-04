import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import { ProductBuyForm } from "@/components/ProductBuyForm";
import { ProductGallery } from "@/components/ProductGallery";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo";
import { formatPrice, KIND_LABELS, GENDER_LABELS } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await prisma.product.findUnique({
    where: { slug },
    include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true },
  });
  if (!p) return { title: "Produit introuvable", robots: { index: false } };
  const priceFmt = new Intl.NumberFormat("fr-FR", {
    style: "currency", currency: "EUR", maximumFractionDigits: 0,
  }).format(p.price);
  const title = p.metaTitle ?? `${p.name}. ${priceFmt}. Floquage 5 € | Maillot PSG`;
  const description = p.metaDesc
    ?? p.shortDescription
    ?? `${p.name} disponible chez Maillot-PSG. ${p.description.slice(0, 100)}… Tailles S à 3XL et enfant 2 à 13 ans, floquage personnalisé (5 €). Livraison 9 à 12 jours ouvrés.`;
  return {
    title,
    description,
    alternates: { canonical: `/produit/${p.slug}` },
    openGraph: {
      title,
      description,
      url: `/produit/${p.slug}`,
      images: p.images[0] ? [p.images[0].url] : undefined,
    },
    other: {
      "og:type": "product",
      "product:price:amount": p.price.toFixed(2),
      "product:price:currency": "EUR",
      "product:availability": p.stock > 0 ? "in stock" : "out of stock",
      "product:condition": "new",
    },
    keywords: p.keywords ?? undefined,
  };
}

export async function generateStaticParams() {
  const ps = await prisma.product.findMany({
    where: { active: true },
    select: { slug: true },
  });
  return ps.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      sizes: { orderBy: { position: "asc" } },
      category: true,
    },
  });
  if (!product || !product.active) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, active: true, id: { not: product.id } },
    include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true },
    take: 4,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            productJsonLd(product),
            breadcrumbJsonLd([
              { name: "Accueil", url: "/" },
              { name: "Maillots", url: "/maillots" },
              { name: product.category.name, url: `/maillots/${product.category.slug}` },
              { name: product.name, url: `/produit/${product.slug}` },
            ]),
          ]),
        }}
      />
      <nav className="text-sm text-neutral-500 mb-4">
        <Link href="/">Accueil</Link> <span className="mx-1">/</span>{" "}
        <Link href="/maillots">Maillots</Link> <span className="mx-1">/</span>{" "}
        <Link href={`/maillots/${product.category.slug}`}>{product.category.name}</Link>{" "}
        <span className="mx-1">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8">
        <ProductGallery images={product.images} alt={product.name} />

        <div>
          <div className="text-xs uppercase tracking-wider text-neutral-500">
            {product.category.name} • {KIND_LABELS[product.kind] ?? product.kind} • {GENDER_LABELS[product.gender] ?? product.gender}
            {product.seasonLabel ? ` • Saison ${product.seasonLabel}` : ""}
          </div>
          <h1 className="text-3xl md:text-4xl font-black mt-2">{product.name}</h1>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-psg-blue">{formatPrice(product.price)}</span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-lg text-neutral-400 line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>

          {product.shortDescription && (
            <p className="mt-4 text-neutral-700">{product.shortDescription}</p>
          )}

          <ProductBuyForm
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              flockingAvailable: product.flockingAvailable,
              flockingPrice: product.flockingPrice,
              image: product.images[0]?.url ?? "",
              sizes: product.sizes.map((s) => ({ id: s.id, label: s.label, kind: s.kind, stock: s.stock })),
            }}
          />

          <ul className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200 text-sm">
            <li className="flex justify-between py-3"><span className="text-neutral-500">Floquage</span><span className="font-medium">Personnalisé, 5 €</span></li>
            <li className="flex justify-between py-3"><span className="text-neutral-500">Livraison</span><span className="font-medium">9 à 12 jours ouvrés</span></li>
            <li className="flex justify-between py-3"><span className="text-neutral-500">Paiement</span><span className="font-medium">Via Instagram (DM)</span></li>
            <li className="flex justify-between py-3"><span className="text-neutral-500">Tailles</span><span className="font-medium">S à 3XL · enfant 2 à 13 ans</span></li>
          </ul>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Description</h2>
        <div className="mt-3 prose prose-neutral max-w-3xl whitespace-pre-line">{product.description}</div>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold">Vous aimerez aussi</h2>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

