import { prisma } from "@/lib/db";
import { ProductForm, emptyProduct } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { position: "asc" } });

  if (categories.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Nouveau produit</h1>
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-5 text-amber-900 text-sm">
          Vous devez d&apos;abord créer au moins une <a href="/admin/categories" className="underline font-medium">catégorie</a>.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nouveau produit</h1>
      <ProductForm
        initial={{ ...emptyProduct, categoryId: categories[0]?.id ?? "" }}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
