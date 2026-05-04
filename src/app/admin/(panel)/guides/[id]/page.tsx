import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { GuideForm } from "@/components/admin/GuideForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditGuide({ params }: Props) {
  const { id } = await params;
  const g = await prisma.guide.findUnique({ where: { id } });
  if (!g) notFound();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Modifier {g.title}</h1>
        <Link href={`/guide/${g.slug}`} target="_blank" className="text-sm text-psg-blue">Voir la page →</Link>
      </div>
      <GuideForm
        initial={{
          id: g.id,
          title: g.title,
          slug: g.slug,
          excerpt: g.excerpt,
          content: g.content,
          metaTitle: g.metaTitle ?? "",
          metaDesc: g.metaDesc ?? "",
          keywords: g.keywords ?? "",
          imageUrl: g.imageUrl ?? "",
          published: g.published,
        }}
      />
    </div>
  );
}
