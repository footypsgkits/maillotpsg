import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPlayersList() {
  const players = await prisma.player.findMany({ orderBy: [{ era: "asc" }, { position2: "asc" }] });
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Joueurs (pages SEO)</h1>
        <Link href="/admin/players/new" className="bg-psg-blue text-white px-4 py-2 rounded-lg text-sm font-medium">
          + Nouveau joueur
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-left">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">N°</th>
              <th className="px-4 py-3">Poste</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.id} className="border-t border-neutral-100">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.number ?? "—"}</td>
                <td className="px-4 py-3">{p.position ?? "—"}</td>
                <td className="px-4 py-3 capitalize">{p.era}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-xs px-2 py-0.5 rounded ${p.active ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-600"}`}>
                    {p.active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/players/${p.id}`} className="text-psg-blue hover:underline">
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
            {players.length === 0 && (
              <tr><td colSpan={6} className="text-center text-neutral-500 py-10">Aucun joueur.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
