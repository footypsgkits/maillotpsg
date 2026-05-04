import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const ItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  name: z.string(),
  size: z.string(),
  unitPrice: z.number(),
  quantity: z.number().int().positive(),
  flocking: z.boolean(),
  flockingName: z.string().optional(),
  flockingNumber: z.string().optional(),
  flockingPrice: z.number(),
});

const CustomerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().min(3),
  city: z.string().min(2),
  zip: z.string().min(2),
  country: z.string().optional(),
  notes: z.string().optional(),
});

const Body = z.object({
  items: z.array(ItemSchema).min(1),
  customer: CustomerSchema,
});

export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
  const { items, customer } = parsed.data;

  const ids = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  const byId = new Map(products.map((p) => [p.id, p]));

  let total = 0;
  for (const it of items) {
    const p = byId.get(it.productId);
    if (!p || !p.active) {
      return NextResponse.json({ error: `Produit indisponible : ${it.name}` }, { status: 400 });
    }
    total += (p.price + (it.flocking ? p.flockingPrice : 0)) * it.quantity;
  }

  const order = await prisma.order.create({
    data: {
      email: customer.email,
      fullName: customer.fullName,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      zip: customer.zip,
      country: customer.country ?? "France",
      notes: customer.notes,
      total,
      status: "nouveau",
      items: {
        create: items.map((it) => {
          const p = byId.get(it.productId)!;
          return {
            productId: p.id,
            productName: p.name,
            productSlug: p.slug,
            size: it.size,
            flocking: it.flocking,
            flockingName: it.flockingName,
            flockingNumber: it.flockingNumber,
            unitPrice: p.price + (it.flocking ? p.flockingPrice : 0),
            quantity: it.quantity,
          };
        }),
      },
    },
  });

  return NextResponse.json({ id: order.id });
}
