import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

const Body = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  number: z.number().int().nullable().optional(),
  position: z.string().optional(),
  nationality: z.string().optional(),
  era: z.string().optional(),
  bio: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  imageUrl: z.string().optional(),
  active: z.boolean().optional(),
  position2: z.number().int().optional(),
});

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  const v = parsed.data;
  let slug = v.slug?.trim() || slugify(v.name);
  const conflict = await prisma.player.findFirst({ where: { slug, NOT: { id } } });
  if (conflict) {
    let i = 2;
    while (await prisma.player.findFirst({ where: { slug: `${slug}-${i}`, NOT: { id } } })) i++;
    slug = `${slug}-${i}`;
  }
  await prisma.player.update({
    where: { id },
    data: {
      name: v.name,
      slug,
      firstName: v.firstName ?? null,
      lastName: v.lastName ?? null,
      number: v.number ?? null,
      position: v.position ?? null,
      nationality: v.nationality ?? null,
      era: v.era ?? "actuel",
      bio: v.bio,
      metaTitle: v.metaTitle ?? null,
      metaDesc: v.metaDesc ?? null,
      imageUrl: v.imageUrl ?? null,
      active: v.active ?? true,
      position2: v.position2 ?? 0,
    },
  });
  return NextResponse.json({ id });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await prisma.player.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
