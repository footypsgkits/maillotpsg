import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { SITE, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { CartIndicator } from "@/components/CartIndicator";
import { MobileMenu } from "@/components/MobileMenu";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Maillots PSG personnalisés, toutes saisons`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "maillot PSG",
    "maillot Paris Saint-Germain",
    "maillot PSG 2026",
    "maillot PSG domicile",
    "maillot PSG extérieur",
    "maillot PSG third",
    "maillot PSG enfant",
    "maillot PSG floquage",
    "maillot Mbappé PSG",
    "maillot Dembélé",
    "maillot Hakimi",
    "maillot gardien PSG",
    "maillot rétro PSG",
    "boutique maillot PSG",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | Maillots PSG personnalisés`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },
  alternates: { canonical: SITE.url },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
      </head>
      <body className="min-h-dvh flex flex-col bg-white text-neutral-900">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-neutral-200">
      <div className="bg-psg-dark text-white text-[11px] uppercase tracking-[0.15em]">
        <div className="mx-auto max-w-7xl px-4 py-2.5 flex justify-between gap-4 font-medium">
          <span className="text-white/85">Livraison 9 à 12 jours ouvrés. Floquage 5 €. Paiement via Instagram.</span>
          <span className="hidden sm:inline text-white/60">{SITE.email}</span>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 h-18 py-3 flex items-center justify-between gap-4 md:gap-6">
        <div className="flex items-center gap-2">
          <MobileMenu />
          <Link href="/" aria-label="Maillot-PSG accueil" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Maillot PSG"
              width={160}
              height={48}
              priority
              className="h-10 w-auto"
            />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
          <Link href="/maillots/domicile" className="hover:text-psg-red">Domicile</Link>
          <Link href="/maillots/exterieur" className="hover:text-psg-red">Extérieur</Link>
          <Link href="/maillots/third" className="hover:text-psg-red">Third</Link>
          <Link href="/maillots/enfant" className="hover:text-psg-red">Enfant</Link>
          <Link href="/maillots/retro" className="hover:text-psg-red">Rétro</Link>
          <Link href="/maillots/speciale" className="hover:text-psg-red">Spéciale</Link>
        </nav>
        <div className="flex items-center gap-4">
          <CartIndicator />
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-psg-dark text-white mt-24">
      <div className="mx-auto max-w-7xl px-4 py-14 grid gap-10 md:grid-cols-5 text-sm">
        <div className="md:col-span-2">
          <Image
            src="/logo.png"
            alt="Maillot PSG"
            width={180}
            height={54}
            className="h-12 w-auto mb-4 brightness-0 invert"
          />
          <p className="text-white/70 max-w-md">
            La référence des maillots du Paris Saint-Germain. Toutes les saisons, toutes les tailles
            (S à 3XL adulte, 2 à 13 ans enfant), tous les joueurs floquables : Mbappé, Dembélé, Hakimi,
            Donnarumma, Marquinhos, Vitinha, Barcola, Kvaratskhelia, Désiré Doué, João Neves.
            Maillots rétro Ronaldinho, Ibrahimović, Beckham, Cavani, Pauleta, Neymar.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-3">Catégories</div>
          <ul className="space-y-1.5 text-white/70">
            <li><Link href="/maillots/domicile">Maillot Domicile</Link></li>
            <li><Link href="/maillots/exterieur">Maillot Extérieur</Link></li>
            <li><Link href="/maillots/third">Maillot Third</Link></li>
            <li><Link href="/maillots/gardien">Maillot Gardien</Link></li>
            <li><Link href="/maillots/enfant">Maillot Enfant</Link></li>
            <li><Link href="/maillots/retro">Maillot Rétro</Link></li>
            <li><Link href="/maillots/training">Training PSG</Link></li>
            <li><Link href="/maillots/edition-speciale">Éditions spéciales</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Joueurs phares</div>
          <ul className="space-y-1.5 text-white/70">
            <li><Link href="/joueur/dembele">Maillot Dembélé</Link></li>
            <li><Link href="/joueur/donnarumma">Maillot Donnarumma</Link></li>
            <li><Link href="/joueur/hakimi">Maillot Hakimi</Link></li>
            <li><Link href="/joueur/marquinhos">Maillot Marquinhos</Link></li>
            <li><Link href="/joueur/kvaratskhelia">Maillot Kvaratskhelia</Link></li>
            <li><Link href="/joueur/doue">Maillot Désiré Doué</Link></li>
            <li><Link href="/joueur/mbappe">Maillot Mbappé (rétro)</Link></li>
            <li><Link href="/joueur">Tous les joueurs →</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Aide & infos</div>
          <ul className="space-y-1.5 text-white/70">
            <li><Link href="/guide/tailles">Guide des tailles</Link></li>
            <li><Link href="/guide">Guides &amp; conseils</Link></li>
            <li><Link href="/saison">Toutes les saisons</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/livraison-retours">Livraison &amp; retours</Link></li>
            <li><Link href="/cgv">CGV</Link></li>
            <li><Link href="/mentions-legales">Mentions légales</Link></li>
            <li className="pt-2">{SITE.email}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {SITE.name}. Site indépendant non affilié au Paris Saint-Germain Football Club.
        Le PSG, son écusson et ses joueurs sont la propriété du Paris Saint-Germain Football Club.
      </div>
    </footer>
  );
}
