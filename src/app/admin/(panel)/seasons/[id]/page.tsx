import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { SeasonForm } from "@/components/admin/SeasonForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditSeason({ params }: Props) {
  const { id } = await params;
  const s = await prisma.season.findUnique({ where: { id } });
  if (!s) notFound();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Modifier saison {s.label}</h1>
        <Link href={`/saison/${s.slug}`} target="_blank" className="text-sm text-psg-blue">Voir la page →</Link>
      </div>
      <SeasonForm
        initial={{
          id: s.id,
          label: s.label,
          slug: s.slug,
          era: s.era,
          shirtMaker: s.shirtMaker ?? "",
          description: s.description,
          metaTitle: s.metaTitle ?? "",
          metaDesc: s.metaDesc ?? "",
          imageUrl: s.imageUrl ?? "",
          active: s.active,
          position: s.position,
        }}
      />
    </div>
  );
}
