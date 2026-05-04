import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PlayerForm } from "@/components/admin/PlayerForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditPlayer({ params }: Props) {
  const { id } = await params;
  const p = await prisma.player.findUnique({ where: { id } });
  if (!p) notFound();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Modifier {p.name}</h1>
        <Link href={`/joueur/${p.slug}`} target="_blank" className="text-sm text-psg-blue">
          Voir la page →
        </Link>
      </div>
      <PlayerForm
        initial={{
          id: p.id,
          name: p.name,
          slug: p.slug,
          firstName: p.firstName ?? "",
          lastName: p.lastName ?? "",
          number: p.number,
          position: p.position ?? "",
          nationality: p.nationality ?? "",
          era: p.era,
          bio: p.bio,
          metaTitle: p.metaTitle ?? "",
          metaDesc: p.metaDesc ?? "",
          imageUrl: p.imageUrl ?? "",
          active: p.active,
          position2: p.position2,
        }}
      />
    </div>
  );
}
