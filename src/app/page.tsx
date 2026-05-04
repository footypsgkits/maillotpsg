import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import { FeaturedGrid } from "@/components/FeaturedGrid";
import type { Metadata } from "next";
import { SITE, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Maillots PSG personnalisés. Domicile, extérieur, third, enfant.",
  description:
    "Achetez votre maillot du PSG : collection 2025-2026, maillots rétro Ronaldinho, Ibrahimović, Mbappé, Neymar, maillots enfants de 2 à 13 ans, gardien Donnarumma, third et édition spéciale. Floquage Dembélé, Hakimi, Doué personnalisable (5 €). Maillots à partir de 25 €, livraison 9 à 12 jours ouvrés.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Maillots PSG personnalisés | Maillot PSG",
    description: SITE.description,
    url: "/",
  },
};

const FAQS = [
  {
    q: "Comment floquer mon maillot PSG ?",
    a: "Sélectionnez votre maillot et votre taille, cochez « Floquage personnalisé » (5 €) avant l'ajout au panier puis indiquez le nom (max 12 caractères) et le numéro (1-2 chiffres) de votre choix. Le floquage utilise la typographie officielle Ligue 1 ou UEFA Champions League selon la saison du maillot.",
  },
  {
    q: "Les maillots PSG sont-ils disponibles en taille enfant ?",
    a: "Oui. Tous nos maillots PSG sont disponibles en tailles enfant de 2 ans à 13 ans, avec floquage personnalisé en option (5 €). C'est l'un de nos rayons phares pour les cadeaux d'anniversaire et de Noël.",
  },
  {
    q: "Quel est le délai de livraison d'un maillot PSG ?",
    a: "Comptez 9 à 12 jours ouvrés pour la France métropolitaine et l'Europe, suivi inclus. Le paiement se finalise par message privé sur Instagram (@maillot.psg) après la mise au panier.",
  },
  {
    q: "Puis-je retourner un maillot PSG ?",
    a: "Vous disposez de 14 jours après réception pour retourner votre maillot. L'échange de taille est gratuit. Les maillots floqués personnalisés ne sont pas reprenables, sauf défaut produit (loi sur le droit de rétractation pour les biens personnalisés).",
  },
  {
    q: "Quels joueurs PSG puis-je floquer ?",
    a: "Tout l'effectif 2025-2026 : Donnarumma, Hakimi, Marquinhos, Kvaratskhelia, Fabián Ruiz, Dembélé (ballon d'or 2025), Doué, Vitinha, Barcola, João Neves… ainsi que les légendes du club : Mbappé, Neymar, Ibrahimović, Ronaldinho, Beckham, Cavani, Pauleta, Pastore.",
  },
  {
    q: "Les maillots PSG sont-ils authentiques ou replica ?",
    a: "Nous proposons les deux versions selon les modèles : la replica (coupe ample, supporter, environ 89,90 €) et l'authentique (Match Player Issue, coupe ajustée, technologie Vaporknit, 130-150 €) identique au maillot porté par les joueurs en match.",
  },
];

export default async function HomePage() {
  const [featured, latest, categories, players, currentSeasons, retroSeasons, guides] = await Promise.all([
    prisma.product.findMany({
      where: { active: true, featured: true },
      include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true },
      orderBy: [{ seasonLabel: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
    }),
    prisma.product.findMany({
      where: { active: true },
      include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true },
      take: 8,
      orderBy: [{ seasonLabel: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
    }),
    prisma.category.findMany({
      where: { slug: { in: ["domicile", "exterieur", "third", "enfant", "retro"] } },
      orderBy: { position: "asc" },
    }),
    prisma.player.findMany({
      where: { active: true, era: "actuel" },
      orderBy: { position2: "asc" },
      take: 10,
    }),
    prisma.season.findMany({
      where: { active: true, era: { in: ["actuelle", "recente"] } },
      orderBy: { position: "asc" },
      take: 4,
    }),
    prisma.season.findMany({
      where: { active: true, era: "retro" },
      orderBy: { position: "asc" },
      take: 4,
    }),
    prisma.guide.findMany({ where: { published: true }, take: 4, orderBy: { publishedAt: "desc" } }),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }}
      />
      <Hero />

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 mt-16">
          <SectionHeading title="Maillots en vedette" subtitle="Sélection de la rédaction" href="/maillots" />
          <FeaturedGrid products={featured} />
        </section>
      )}

      {/* Joueurs */}
      {players.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 mt-16">
          <SectionHeading
            title="Maillot PSG par joueur"
            subtitle="Effectif 2025-2026, floquage personnalisé (5 €)"
            href="/joueur"
          />
          <div className="mt-6 -mx-4 px-4 overflow-x-auto">
            <div className="flex gap-px bg-neutral-200 min-w-max">
              {players.map((p) => (
                <Link
                  key={p.id}
                  href={`/joueur/${p.slug}`}
                  className="group bg-white hover:bg-psg-dark hover:text-white px-6 py-5 transition-colors min-w-[180px]"
                >
                  {p.number != null && (
                    <div className="text-3xl font-black tabular-nums text-neutral-200 group-hover:text-psg-red leading-none">
                      {String(p.number).padStart(2, "0")}
                    </div>
                  )}
                  <div className="mt-2 font-semibold text-sm uppercase tracking-tight">{p.name}</div>
                  <div className="text-[11px] text-neutral-400 group-hover:text-white/60 mt-1 uppercase tracking-wider">
                    Floquer →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nouveautés */}
      {latest.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 mt-16">
          <SectionHeading title="Nouveautés" subtitle="Derniers maillots ajoutés" href="/maillots" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">
            {latest.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {latest.length === 0 && (
        <section className="mx-auto max-w-3xl px-4 mt-20 text-center">
          <div className="border-y border-neutral-200 py-12">
            <div className="text-[10px] uppercase tracking-[0.2em] text-psg-red font-mono">Bientôt</div>
            <h2 className="text-2xl font-black mt-3">Boutique en cours de création</h2>
            <p className="text-neutral-600 mt-2 text-sm">
              Les premiers maillots arrivent très bientôt. Pour ajouter du stock, passez par{" "}
              <Link href="/admin" className="underline underline-offset-4 hover:text-psg-red">/admin</Link>.
            </p>
          </div>
        </section>
      )}

      {/* Saisons */}
      {currentSeasons.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 mt-16">
          <SectionHeading title="Maillots PSG par saison" subtitle="Collection 2025-2026 et saisons récentes" href="/saison" />
          <ul className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200">
            {currentSeasons.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/saison/${s.slug}`}
                  className="group flex items-center justify-between gap-6 py-5 hover:bg-neutral-50 transition px-2"
                >
                  <div className="flex items-baseline gap-6 min-w-0">
                    <span className="text-3xl font-black tabular-nums text-neutral-300 group-hover:text-psg-red leading-none whitespace-nowrap">
                      {s.label}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold uppercase tracking-tight">Maillot PSG {s.label}</div>
                      <p className="text-sm text-neutral-500 mt-0.5 line-clamp-1">{s.description}</p>
                    </div>
                  </div>
                  <span className="text-neutral-300 group-hover:text-psg-red text-xl transition-transform group-hover:translate-x-1 shrink-0">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Rétro */}
      {retroSeasons.length > 0 && (
        <section className="mt-20 bg-psg-dark text-white py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-end justify-between gap-4 border-b border-white/15 pb-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-psg-red font-bold">Archives</div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-2">Maillots rétro &amp; vintage</h2>
                <p className="text-white/60 mt-1.5 text-sm">Ronaldinho, Ibrahimović, Beckham, Mbappé.</p>
              </div>
              <Link href="/maillots/retro" className="text-sm font-semibold text-white/80 hover:text-psg-red whitespace-nowrap">
                Voir tout →
              </Link>
            </div>
            <ul className="mt-6 divide-y divide-white/10">
              {retroSeasons.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/saison/${s.slug}`}
                    className="group flex items-center justify-between gap-6 py-5 hover:bg-white/5 transition px-2"
                  >
                    <div className="flex items-baseline gap-6 min-w-0">
                      <span className="text-3xl font-black tabular-nums text-white/30 group-hover:text-psg-red leading-none whitespace-nowrap">
                        {s.label}
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold uppercase tracking-tight">Maillot PSG {s.label}</div>
                        <p className="text-sm text-white/50 mt-0.5 line-clamp-1">{s.description}</p>
                      </div>
                    </div>
                    <span className="text-white/30 group-hover:text-psg-red text-xl transition-transform group-hover:translate-x-1 shrink-0">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Catégories — index navigation en bas de page */}
      <section className="mx-auto max-w-7xl px-4 mt-20">
        <SectionHeading title="Toutes les catégories" subtitle="Naviguez par type de maillot" />
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y divide-neutral-200 border border-neutral-200">
          {[...(categories.length > 0 ? categories : DEFAULT_CATS), { slug: "speciale", name: "Spéciale" }].map(
            (c, idx) => (
              <Link
                key={c.slug}
                href={`/maillots/${c.slug}`}
                className="group relative px-6 py-10 flex items-center justify-between hover:bg-psg-dark hover:text-white transition-colors"
              >
                <div>
                  <div className="text-[10px] font-mono text-neutral-400 group-hover:text-psg-red tracking-widest">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-2 font-bold text-lg uppercase tracking-tight">{c.name}</div>
                </div>
                <span className="text-neutral-300 group-hover:text-psg-red text-xl transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            ),
          )}
        </div>
      </section>

      {/* Guides */}
      {guides.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 mt-20">
          <SectionHeading title="Guides &amp; conseils" subtitle="Tailles, floquage, authentique vs replica" href="/guide" />
          <ul className="mt-6 grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200 border-y border-neutral-200">
            {guides.slice(0, 4).map((g, idx) => (
              <li key={g.id} className={idx >= 2 ? "md:border-t md:border-neutral-200" : ""}>
                <Link href={`/guide/${g.slug}`} className="group block p-6 hover:bg-neutral-50 transition">
                  <div className="text-[10px] uppercase tracking-widest text-psg-red font-mono">Guide 0{idx + 1}</div>
                  <div className="font-bold text-lg mt-2 group-hover:text-psg-blue">{g.title}</div>
                  <p className="text-sm text-neutral-500 mt-2 line-clamp-2">{g.excerpt}</p>
                  <span className="inline-block mt-3 text-xs uppercase tracking-wider font-semibold text-psg-blue group-hover:text-psg-red">
                    Lire le guide →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* SEO long content */}
      <SeoBlock />

      {/* Reassurance */}
      <Reassurance />

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 mt-20">
        <div className="text-[10px] uppercase tracking-[0.2em] text-psg-red font-mono">FAQ</div>
        <h2 className="text-2xl md:text-3xl font-black mt-2">Questions fréquentes sur le maillot PSG</h2>
        <div className="mt-8 border-t border-neutral-200">
          {FAQS.map((f) => (
            <details key={f.q} className="group border-b border-neutral-200 py-5">
              <summary className="font-semibold cursor-pointer flex justify-between items-center gap-4 list-none">
                <span>{f.q}</span>
                <span className="text-2xl text-neutral-400 group-open:rotate-45 transition-transform shrink-0">+</span>
              </summary>
              <p className="text-neutral-700 mt-3 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

function Hero() {
  return (
    <section className="relative bg-psg-dark text-white overflow-hidden">
      <Image
        src="/hero.png"
        alt="Maillot PSG saison 2025-2026 porté au Parc des Princes"
        fill
        priority
        sizes="100vw"
        className="object-cover object-right-top opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-psg-dark via-psg-dark/90 to-transparent" />
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-psg-red hidden md:block" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-24 md:py-36 grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/70 font-semibold">
            <span className="h-px w-8 bg-psg-red" />
            Saison 25/26 · à partir de 25 €
          </div>

          <h1 className="mt-6 text-5xl md:text-7xl font-black tracking-tight leading-[0.95]">
            Le maillot du PSG.
            <br />
            <span className="text-psg-red">À votre nom.</span>
          </h1>

          <p className="mt-6 text-lg text-white/80 max-w-lg leading-relaxed">
            Toutes les collections du Paris Saint-Germain réunies en un seul endroit. Domicile, extérieur, third,
            gardien, rétro et enfant. Floquage personnalisé en typographie officielle Ligue 1.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/maillots"
              className="group inline-flex items-center gap-3 bg-white text-psg-dark font-semibold px-7 py-4 hover:bg-psg-red hover:text-white transition-colors"
            >
              Voir la collection
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/maillots/enfant"
              className="text-sm font-semibold text-white/90 hover:text-white underline underline-offset-4"
            >
              Tailles enfant 2 à 13 ans
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-3 text-xs uppercase tracking-wider text-white/60 font-medium">
            <span>Livraison 9 à 12 jours ouvrés</span>
            <span className="h-3 w-px bg-white/20" />
            <span>Floquage 5 €</span>
            <span className="h-3 w-px bg-white/20" />
            <span>Paiement via Instagram</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ title, subtitle, href }: { title: string; subtitle?: string; href?: string }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-neutral-200 pb-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight">{title}</h2>
        {subtitle && <p className="text-neutral-500 mt-1.5 text-sm">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="text-sm font-semibold text-psg-blue hover:text-psg-red whitespace-nowrap">
          Voir tout →
        </Link>
      )}
    </div>
  );
}

function Reassurance() {
  const items = [
    { n: "01", t: "Floquage 5 €", d: "Nom et numéro à votre choix sur tous les maillots adultes et enfants, en typographie officielle Ligue 1 ou UEFA Champions League." },
    { n: "02", t: "Toutes les tailles", d: "Du S au 3XL pour les adultes, du 2 au 13 ans pour les enfants." },
    { n: "03", t: "Livraison 9 à 12 jours", d: "Délai d'acheminement standard en France et en Europe, suivi inclus." },
    { n: "04", t: "Paiement via Instagram", d: "Commandes finalisées en DM sur notre compte Instagram. Réponse sous quelques heures." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 mt-20">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 border-y border-neutral-200">
        {items.map((i) => (
          <div key={i.t} className="p-6 group">
            <div className="text-xs font-mono text-psg-red tracking-widest">{i.n}</div>
            <div className="font-bold text-base mt-3">{i.t}</div>
            <div className="text-sm text-neutral-600 mt-2 leading-relaxed">{i.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SeoBlock() {
  return (
    <section className="mx-auto max-w-4xl px-4 mt-20">
      <article className="prose prose-neutral max-w-none">
        <h2 className="text-2xl md:text-3xl font-black">Pourquoi acheter votre maillot PSG sur Maillot-PSG&nbsp;?</h2>
        <p className="text-neutral-700 leading-relaxed mt-3">
          Maillot-PSG est <strong>la boutique en ligne spécialisée maillots du Paris Saint-Germain</strong>.
          Que vous cherchiez le mythique maillot domicile bleu marine porté au Parc des Princes, le maillot extérieur
          blanc des déplacements en Ligue 1 et UEFA Champions League, le maillot third de la saison, le quatrième
          maillot en édition limitée, ou un <strong>maillot PSG rétro</strong> des grandes années
          (Ronaldinho 2001, Ibrahimović 2012, Beckham 2013, Cavani, Neymar), vous trouverez chez nous l&apos;ensemble
          des collections du club et personnalisables.
        </p>

        <h3 className="text-xl font-bold mt-8">Maillots adultes : du S au 3XL</h3>
        <p className="text-neutral-700 leading-relaxed mt-2">
          Tous nos maillots <strong>PSG homme et femme</strong> sont disponibles en plusieurs tailles
          (du S au 3XL) pour s&apos;adapter à toutes les morphologies. Coupe replica pour les supporters
          (à partir de 25 €) ou coupe authentique Match Player Issue identique aux joueurs.
          Choisissez votre maillot domicile, extérieur, third ou fourth puis ajoutez le floquage de votre joueur préféré&nbsp;:
          <strong> Ousmane Dembélé n°10 (ballon d&apos;or 2025), Achraf Hakimi n°2, Marquinhos n°5,
          Gianluigi Donnarumma n°1, Vitinha n°17, Bradley Barcola n°29, Khvicha Kvaratskhelia n°7,
          Désiré Doué n°14, João Neves n°87</strong>, ou votre propre nom et numéro.
        </p>

        <h3 className="text-xl font-bold mt-8">Maillots enfants : de 2 à 13 ans</h3>
        <p className="text-neutral-700 leading-relaxed mt-2">
          Faites plaisir aux jeunes supporters parisiens avec nos <strong>maillots PSG enfant</strong>
          déclinés du 2 ans au 13 ans (XXS/16, XS/18, S/20, M/22, L/24, XL/26, XXL/28). Floquage personnalisé en option (5 €)&nbsp;:
          nom + numéro de leur joueur préféré au dos. Idéal cadeau d&apos;anniversaire, de Noël ou pour la rentrée.
          Si votre enfant grandit vite, prenez la taille au-dessus : l&apos;échange de taille reste gratuit chez nous.
        </p>

        <h3 className="text-xl font-bold mt-8">Maillot de gardien Donnarumma et training PSG</h3>
        <p className="text-neutral-700 leading-relaxed mt-2">
          La gamme inclut les <strong>maillots de gardien PSG</strong> portés par Gianluigi Donnarumma, héros
          de la finale de Ligue des champions 2025 face à l&apos;Inter Milan, ainsi que les vestes,
          sweats, polos et survêtements <strong>training PSG</strong> portés par les joueurs au centre Ooredoo
          de Poissy avant les matchs.
        </p>

        <h3 className="text-xl font-bold mt-8">Maillots rétro : l&apos;histoire du PSG depuis 1970</h3>
        <p className="text-neutral-700 leading-relaxed mt-2">
          Revivez les grandes saisons parisiennes avec notre sélection de <strong>maillots vintage et rétro</strong>&nbsp;:
          maillot Ronaldinho 21 saison 2001-2002, maillot Ibrahimović 10 ère QSI, maillot Beckham 32 dernière saison
          de carrière, maillot Mbappé 7 (2017-2024), maillot Neymar 10, maillot Cavani 9, maillot Pauleta 9,
          maillot Pastore 27, maillot Thiago Silva 2, maillot Lavezzi 22. Notre catalogue couvre toutes les
          époques iconiques du club, des années 70 à aujourd&apos;hui.
        </p>

        <h3 className="text-xl font-bold mt-8">Floquage personnalisé en typographie officielle</h3>
        <p className="text-neutral-700 leading-relaxed mt-2">
          Tous nos maillots peuvent être <strong>floqués au nom et numéro de votre choix</strong> pour
          5 € seulement. Le floquage est appliqué au dos en typographie officielle Ligue 1 ou UEFA Champions League
          selon la saison du maillot, par technique thermocollée garantie 100+ lavages sans craqueler.
          C&apos;est l&apos;option idéale pour offrir un cadeau unique à un supporter du PSG.
          <Link href="/guide/floquage-maillot-psg" className="text-psg-blue ml-1">Lire notre guide complet du floquage →</Link>
        </p>
      </article>
    </section>
  );
}

const DEFAULT_CATS = [
  { name: "Domicile", slug: "domicile" },
  { name: "Extérieur", slug: "exterieur" },
  { name: "Third", slug: "third" },
  { name: "Gardien", slug: "gardien" },
  { name: "Enfant", slug: "enfant" },
  { name: "Rétro", slug: "retro" },
];
