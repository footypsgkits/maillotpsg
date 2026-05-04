import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const [products, categories, players, seasons, guides] = await Promise.all([
    prisma.product.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.player.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
    prisma.season.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
    prisma.guide.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1, changeFrequency: "weekly" },
    { url: `${base}/maillots`, priority: 0.95, changeFrequency: "weekly" },
    { url: `${base}/joueur`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/saison`, priority: 0.85, changeFrequency: "monthly" },
    { url: `${base}/guide`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${base}/contact`, priority: 0.4 },
    { url: `${base}/livraison-retours`, priority: 0.4 },
    { url: `${base}/cgv`, priority: 0.2 },
    { url: `${base}/mentions-legales`, priority: 0.2 },
  ];

  return [
    ...staticPages,
    ...categories.map((c) => ({
      url: `${base}/maillots/${c.slug}`,
      lastModified: c.updatedAt,
      priority: 0.85,
      changeFrequency: "weekly" as const,
    })),
    ...players.map((p) => ({
      url: `${base}/joueur/${p.slug}`,
      lastModified: p.updatedAt,
      priority: 0.8,
      changeFrequency: "weekly" as const,
    })),
    ...seasons.map((s) => ({
      url: `${base}/saison/${s.slug}`,
      lastModified: s.updatedAt,
      priority: 0.75,
      changeFrequency: "monthly" as const,
    })),
    ...guides.map((g) => ({
      url: `${base}/guide/${g.slug}`,
      lastModified: g.updatedAt,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
    ...products.map((p) => ({
      url: `${base}/produit/${p.slug}`,
      lastModified: p.updatedAt,
      priority: 0.7,
      changeFrequency: "weekly" as const,
    })),
  ];
}
