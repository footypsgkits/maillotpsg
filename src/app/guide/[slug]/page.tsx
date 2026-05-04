import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const guides = await prisma.guide.findMany({ where: { published: true }, select: { slug: true } });
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const g = await prisma.guide.findUnique({ where: { slug } });
  if (!g) return { title: "Guide introuvable", robots: { index: false } };
  return {
    title: g.metaTitle ?? g.title,
    description: g.metaDesc ?? g.excerpt,
    alternates: { canonical: `/guide/${g.slug}` },
    keywords: g.keywords ?? undefined,
    openGraph: { title: g.title, description: g.excerpt, url: `/guide/${g.slug}`, type: "article" },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const g = await prisma.guide.findUnique({ where: { slug } });
  if (!g || !g.published) notFound();

  const others = await prisma.guide.findMany({
    where: { published: true, NOT: { slug } },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            articleJsonLd(g),
            breadcrumbJsonLd([
              { name: "Accueil", url: "/" },
              { name: "Guides", url: "/guide" },
              { name: g.title, url: `/guide/${g.slug}` },
            ]),
          ]),
        }}
      />
      <nav className="text-sm text-neutral-500 mb-3">
        <Link href="/">Accueil</Link> <span className="mx-1">/</span>{" "}
        <Link href="/guide">Guides</Link> <span className="mx-1">/</span>{" "}
        <span>{g.title}</span>
      </nav>

      <article>
        <h1 className="text-3xl md:text-5xl font-black">{g.title}</h1>
        <p className="text-neutral-500 mt-2 text-sm">
          Mis à jour le{" "}
          {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(g.updatedAt)}
        </p>
        <p className="text-lg text-neutral-700 mt-4">{g.excerpt}</p>
        <div
          className="prose prose-neutral mt-8 max-w-none"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: g.content }}
        />
      </article>

      {others.length > 0 && (
        <section className="mt-16 pt-8 border-t border-neutral-200">
          <h2 className="text-xl font-bold">Autres guides à lire</h2>
          <ul className="mt-4 space-y-2">
            {others.map((o) => (
              <li key={o.id}>
                <Link href={`/guide/${o.slug}`} className="text-psg-blue hover:underline">
                  → {o.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
