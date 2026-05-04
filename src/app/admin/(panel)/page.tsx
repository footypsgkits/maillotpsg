import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, categoryCount, orderCount, recentOrders, lastProducts, salesAgg] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: true },
      }),
      prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { category: true },
      }),
      prisma.order.aggregate({ _sum: { total: true } }),
    ]);

  const stats = [
    { label: "Produits", value: productCount, href: "/admin/products" },
    { label: "Catégories", value: categoryCount, href: "/admin/categories" },
    { label: "Commandes", value: orderCount, href: "/admin/orders" },
    { label: "CA total", value: formatPrice(salesAgg._sum.total ?? 0) },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <Link
          href="/admin/products/new"
          className="bg-psg-blue text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Nouveau produit
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href ?? "#"}
            className="rounded-xl bg-white border border-neutral-200 p-4 hover:shadow"
          >
            <div className="text-sm text-neutral-500">{s.label}</div>
            <div className="text-2xl font-bold mt-1">{s.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-neutral-200">
          <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
            <h2 className="font-semibold">Derniers produits</h2>
            <Link href="/admin/products" className="text-sm text-psg-blue">Tout voir →</Link>
          </div>
          <ul className="divide-y divide-neutral-100">
            {lastProducts.map((p) => (
              <li key={p.id} className="p-4 flex justify-between text-sm">
                <Link href={`/admin/products/${p.id}`} className="hover:underline">{p.name}</Link>
                <span className="text-neutral-500">{p.category.name}</span>
              </li>
            ))}
            {lastProducts.length === 0 && (
              <li className="p-6 text-sm text-neutral-500 text-center">Aucun produit pour l&apos;instant.</li>
            )}
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200">
          <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
            <h2 className="font-semibold">Dernières commandes</h2>
            <Link href="/admin/orders" className="text-sm text-psg-blue">Tout voir →</Link>
          </div>
          <ul className="divide-y divide-neutral-100">
            {recentOrders.map((o) => (
              <li key={o.id} className="p-4 flex justify-between text-sm">
                <span>#{o.id.slice(-6).toUpperCase()} · {o.fullName}</span>
                <span className="font-semibold">{formatPrice(o.total)}</span>
              </li>
            ))}
            {recentOrders.length === 0 && (
              <li className="p-6 text-sm text-neutral-500 text-center">Aucune commande pour l&apos;instant.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
