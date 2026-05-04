import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

const Body = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  position: z.number().int().optional(),
});

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const v = parsed.data;
  let slug = v.slug?.trim() || slugify(v.name);
  const conflict = await prisma.category.findFirst({
    where: { slug, NOT: { id } },
  });
  if (conflict) {
    let i = 2;
    while (await prisma.category.findFirst({ where: { slug: `${slug}-${i}`, NOT: { id } } })) i++;
    slug = `${slug}-${i}`;
  }
  const cat = await prisma.category.update({
    where: { id },
    data: {
      name: v.name,
      slug,
      description: v.description || null,
      metaTitle: v.metaTitle || null,
      metaDesc: v.metaDesc || null,
      position: v.position ?? 0,
    },
  });
  return NextResponse.json({ id: cat.id });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    return NextResponse.json(
      { error: "Catégorie non vide : déplacez ou supprimez ses produits d'abord." },
      { status: 400 },
    );
  }
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
