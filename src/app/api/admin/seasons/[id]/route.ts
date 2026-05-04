import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

const Body = z.object({
  label: z.string().min(1),
  slug: z.string().optional(),
  era: z.string().optional(),
  shirtMaker: z.string().optional(),
  description: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  imageUrl: z.string().optional(),
  active: z.boolean().optional(),
  position: z.number().int().optional(),
});

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  const v = parsed.data;
  let slug = v.slug?.trim() || slugify(v.label);
  const conflict = await prisma.season.findFirst({ where: { slug, NOT: { id } } });
  if (conflict) {
    let i = 2;
    while (await prisma.season.findFirst({ where: { slug: `${slug}-${i}`, NOT: { id } } })) i++;
    slug = `${slug}-${i}`;
  }
  await prisma.season.update({
    where: { id },
    data: {
      label: v.label,
      slug,
      era: v.era ?? "actuelle",
      shirtMaker: v.shirtMaker ?? null,
      description: v.description,
      metaTitle: v.metaTitle ?? null,
      metaDesc: v.metaDesc ?? null,
      imageUrl: v.imageUrl ?? null,
      active: v.active ?? true,
      position: v.position ?? 0,
    },
  });
  return NextResponse.json({ id });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await prisma.season.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
