import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

const Body = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  keywords: z.string().optional(),
  imageUrl: z.string().optional(),
  published: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  const v = parsed.data;
  let slug = v.slug?.trim() || slugify(v.title);
  let i = 2;
  while (await prisma.guide.findUnique({ where: { slug } })) slug = `${slug}-${i++}`;
  const g = await prisma.guide.create({
    data: {
      title: v.title,
      slug,
      excerpt: v.excerpt,
      content: v.content,
      metaTitle: v.metaTitle ?? null,
      metaDesc: v.metaDesc ?? null,
      keywords: v.keywords ?? null,
      imageUrl: v.imageUrl ?? null,
      published: v.published ?? true,
    },
  });
  return NextResponse.json({ id: g.id });
}
