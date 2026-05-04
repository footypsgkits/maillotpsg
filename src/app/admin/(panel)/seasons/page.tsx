import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSeasonsList() {
  const seasons = await prisma.season.findMany({
    orderBy: [{ era: "asc" }, { position: "asc" }],
    include: { _count: { select: { products: true } } },
  });
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Saisons (pages SEO)</h1>
        <Link href="/admin/seasons/new" className="bg-psg-blue text-white px-4 py-2 rounded-lg text-sm font-medium">
          + Nouvelle saison
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-left">
            <tr>
              <th className="px-4 py-3">Saison</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Époque</th>
              <th className="px-4 py-3">Maillots liés</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {seasons.map((s) => (
              <tr key={s.id} className="border-t border-neutral-100">
                <td className="px-4 py-3 font-medium">{s.label}</td>
                <td className="px-4 py-3 text-neutral-500">{s.slug}</td>
                <td className="px-4 py-3 capitalize">{s.era}</td>
                <td className="px-4 py-3">{s._count.products}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-xs px-2 py-0.5 rounded ${s.active ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-600"}`}>
                    {s.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/seasons/${s.id}`} className="text-psg-blue hover:underline">Modifier</Link>
                </td>
              </tr>
            ))}
            {seasons.length === 0 && (
              <tr><td colSpan={6} className="text-center text-neutral-500 py-10">Aucune saison.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
