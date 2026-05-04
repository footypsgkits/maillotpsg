import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminGuidesList() {
  const guides = await prisma.guide.findMany({ orderBy: { publishedAt: "desc" } });
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Guides SEO</h1>
        <Link href="/admin/guides/new" className="bg-psg-blue text-white px-4 py-2 rounded-lg text-sm font-medium">
          + Nouveau guide
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-left">
            <tr>
              <th className="px-4 py-3">Titre</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {guides.map((g) => (
              <tr key={g.id} className="border-t border-neutral-100">
                <td className="px-4 py-3 font-medium max-w-md truncate">{g.title}</td>
                <td className="px-4 py-3 text-neutral-500">{g.slug}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-xs px-2 py-0.5 rounded ${g.published ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-600"}`}>
                    {g.published ? "Publié" : "Brouillon"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/guides/${g.id}`} className="text-psg-blue hover:underline">Modifier</Link>
                </td>
              </tr>
            ))}
            {guides.length === 0 && (
              <tr><td colSpan={4} className="text-center text-neutral-500 py-10">Aucun guide.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
