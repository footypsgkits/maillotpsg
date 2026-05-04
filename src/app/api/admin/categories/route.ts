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

export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const v = parsed.data;
  const baseSlug = v.slug?.trim() || slugify(v.name);
  let slug = baseSlug;
  let i = 2;
  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }
  const cat = await prisma.category.create({
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
