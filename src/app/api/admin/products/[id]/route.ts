import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

const SizeSchema = z.object({
  label: z.string(),
  kind: z.enum(["adulte", "enfant"]),
  stock: z.number().int().min(0),
});
const ImageSchema = z.object({ url: z.string(), alt: z.string().optional() });

const Body = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().min(1),
  shortDescription: z.string().optional(),
  price: z.number().min(0),
  oldPrice: z.number().nullable().optional(),
  sku: z.string().nullable().optional(),
  stock: z.number().int().min(0),
  season: z.string().optional(),
  team: z.string().optional(),
  kind: z.string(),
  gender: z.string(),
  flockingAvailable: z.boolean(),
  flockingPrice: z.number().min(0),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  keywords: z.string().optional(),
  active: z.boolean(),
  featured: z.boolean(),
  categoryId: z.string().min(1),
  sizes: z.array(SizeSchema),
  images: z.array(ImageSchema),
});

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const v = parsed.data;

  let slug = v.slug?.trim() || slugify(v.name);
  const conflict = await prisma.product.findFirst({
    where: { slug, NOT: { id } },
  });
  if (conflict) {
    let i = 2;
    while (await prisma.product.findFirst({ where: { slug: `${slug}-${i}`, NOT: { id } } })) i++;
    slug = `${slug}-${i}`;
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.productSize.deleteMany({ where: { productId: id } });
    await tx.productImage.deleteMany({ where: { productId: id } });
    return tx.product.update({
      where: { id },
      data: {
        name: v.name,
        slug,
        description: v.description,
        shortDescription: v.shortDescription || null,
        price: v.price,
        oldPrice: v.oldPrice ?? null,
        sku: v.sku || null,
        stock: v.stock,
        seasonLabel: v.season || null,
        team: v.team ?? "PSG",
        kind: v.kind,
        gender: v.gender,
        flockingAvailable: v.flockingAvailable,
        flockingPrice: v.flockingPrice,
        metaTitle: v.metaTitle || null,
        metaDesc: v.metaDesc || null,
        keywords: v.keywords || null,
        active: v.active,
        featured: v.featured,
        categoryId: v.categoryId,
        sizes: {
          create: v.sizes.map((s, idx) => ({
            label: s.label,
            kind: s.kind,
            stock: s.stock,
            position: idx,
          })),
        },
        images: {
          create: v.images.map((img, idx) => ({
            url: img.url,
            alt: img.alt ?? null,
            position: idx,
          })),
        },
      },
    });
  });

  return NextResponse.json({ id: updated.id });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
