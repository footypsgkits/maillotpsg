import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Commandes</h1>
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-left">
            <tr>
              <th className="px-4 py-3">N°</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Articles</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-neutral-100 align-top">
                <td className="px-4 py-3 font-mono text-xs">#{o.id.slice(-6).toUpperCase()}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{o.fullName}</div>
                  <div className="text-xs text-neutral-500">{o.email}</div>
                  <div className="text-xs text-neutral-500">{o.zip} {o.city}</div>
                </td>
                <td className="px-4 py-3 text-xs">
                  <ul className="space-y-1">
                    {o.items.map((it) => (
                      <li key={it.id}>
                        {it.quantity}× {it.productName} <span className="text-neutral-500">({it.size})</span>
                        {it.flocking && (
                          <span className="text-psg-blue"> · {it.flockingName ?? ""} {it.flockingNumber ?? ""}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3 font-semibold">{formatPrice(o.total)}</td>
                <td className="px-4 py-3 text-xs text-neutral-500">{new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(o.createdAt)}</td>
                <td className="px-4 py-3">
                  <span className="inline-block text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700">{o.status}</span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-neutral-500 py-10">Aucune commande pour l&apos;instant.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
