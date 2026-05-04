import { prisma } from "@/lib/db";
import { CategoriesAdmin } from "@/components/admin/CategoriesAdmin";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Catégories</h1>
      <CategoriesAdmin
        initial={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description ?? "",
          metaTitle: c.metaTitle ?? "",
          metaDesc: c.metaDesc ?? "",
          position: c.position,
          productCount: c._count.products,
        }))}
      />
    </div>
  );
}
