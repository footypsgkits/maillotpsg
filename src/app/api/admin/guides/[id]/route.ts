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

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  const v = parsed.data;
  let slug = v.slug?.trim() || slugify(v.title);
  const conflict = await prisma.guide.findFirst({ where: { slug, NOT: { id } } });
  if (conflict) {
    let i = 2;
    while (await prisma.guide.findFirst({ where: { slug: `${slug}-${i}`, NOT: { id } } })) i++;
    slug = `${slug}-${i}`;
  }
  await prisma.guide.update({
    where: { id },
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
  return NextResponse.json({ id });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await prisma.guide.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
