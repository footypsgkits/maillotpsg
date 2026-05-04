import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditProduct({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { sizes: true, images: { orderBy: { position: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { position: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Modifier {product.name}</h1>
        <Link
          href={`/produit/${product.slug}`}
          target="_blank"
          className="text-sm text-psg-blue hover:underline"
        >
          Voir sur la boutique →
        </Link>
      </div>
      <ProductForm
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription ?? "",
          price: product.price,
          oldPrice: product.oldPrice,
          sku: product.sku ?? "",
          stock: product.stock,
          season: product.seasonLabel ?? "",
          team: product.team,
          kind: product.kind,
          gender: product.gender,
          flockingAvailable: product.flockingAvailable,
          flockingPrice: product.flockingPrice,
          metaTitle: product.metaTitle ?? "",
          metaDesc: product.metaDesc ?? "",
          keywords: product.keywords ?? "",
          active: product.active,
          featured: product.featured,
          categoryId: product.categoryId,
          sizes: product.sizes.map((s) => ({
            label: s.label,
            kind: (s.kind === "enfant" ? "enfant" : "adulte") as "enfant" | "adulte",
            stock: s.stock,
          })),
          images: product.images.map((i) => ({ url: i.url, alt: i.alt ?? "" })),
        }}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
