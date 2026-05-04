import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guide des tailles maillot PSG : homme, femme, enfant",
  description:
    "Toutes les mesures des maillots PSG pour bien choisir votre taille. Tableau homme (S à XXL), femme (S à XL), enfant (2 à 13 ans). Longueur du maillot, poitrine, taille, hanches, longueur de pantalon : conversions complètes en centimètres.",
  alternates: { canonical: "/guide/tailles" },
  keywords: [
    "guide tailles maillot psg",
    "taille maillot psg",
    "taille maillot psg homme",
    "taille maillot psg femme",
    "taille maillot psg enfant",
    "mesures maillot psg",
    "correspondance taille maillot psg",
  ],
};

const HOMMES = [
  { size: "S", height: "165 – 170 cm", length: "69 cm", chest: "50 cm" },
  { size: "M", height: "170 – 175 cm", length: "71 cm", chest: "52 cm" },
  { size: "L", height: "175 – 180 cm", length: "73 cm", chest: "54 cm" },
  { size: "XL", height: "185 – 190 cm", length: "75 cm", chest: "56 cm" },
  { size: "XXL", height: "190 – 200 cm", length: "77 cm", chest: "58 cm" },
];

const FEMMES = [
  { size: "S", height: "150 – 155 cm", length: "63 cm", bust: "42 cm", waist: "38,5 cm", hips: "47 cm" },
  { size: "M", height: "155 – 160 cm", length: "66 cm", bust: "44,5 cm", waist: "40 cm", hips: "49 cm" },
  { size: "L", height: "160 – 165 cm", length: "69 cm", bust: "47 cm", waist: "42 cm", hips: "51 cm" },
  { size: "XL", height: "165 – 170 cm", length: "72 cm", bust: "49,5 cm", waist: "44 cm", hips: "53 cm" },
];

const ENFANTS = [
  { size: "XXS / 16", age: "2 – 3 ans", height: "95 – 105 cm", length: "43 cm", chest: "32 cm", pant: "32 cm", waist: "20 – 37 cm" },
  { size: "XS / 18", age: "3 – 4 ans", height: "105 – 115 cm", length: "47 cm", chest: "34 cm", pant: "34 cm", waist: "21 – 39 cm" },
  { size: "S / 20", age: "4 – 5 ans", height: "115 – 125 cm", length: "50 cm", chest: "36 cm", pant: "36 cm", waist: "22 – 41 cm" },
  { size: "M / 22", age: "6 – 7 ans", height: "125 – 135 cm", length: "53 cm", chest: "38 cm", pant: "38 cm", waist: "23 – 42 cm" },
  { size: "L / 24", age: "8 – 9 ans", height: "135 – 145 cm", length: "56 cm", chest: "40 cm", pant: "39 cm", waist: "24 – 44 cm" },
  { size: "XL / 26", age: "10 – 11 ans", height: "145 – 155 cm", length: "59 cm", chest: "42 cm", pant: "40 cm", waist: "25 – 47 cm" },
  { size: "XXL / 28", age: "12 – 13 ans", height: "155 – 165 cm", length: "62 cm", chest: "44 cm", pant: "43 cm", waist: "26 – 50 cm" },
];

export default function GuideTaillesPage() {
  return (
    <div className="bg-white">
      <header className="bg-psg-dark text-white">
        <div className="mx-auto max-w-5xl px-4 md:px-8 py-16 md:py-24">
          <nav className="text-xs text-white/60 mb-6">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <span className="mx-2">/</span>
            <Link href="/guide" className="hover:text-white">Guides</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Tailles</span>
          </nav>
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/70 font-semibold">
            <span className="h-px w-8 bg-psg-red" />
            Guide
          </div>
          <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight leading-[0.95]">
            Guide des tailles
          </h1>
          <p className="mt-5 text-lg text-white/80 max-w-2xl leading-relaxed">
            Toutes les mesures de nos maillots PSG en homme, femme et enfant. Si vous hésitez entre deux tailles,
            prenez la taille au-dessus pour un confort optimal. Toutes les mesures sont indiquées en centimètres
            et correspondent au produit à plat.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 md:px-8 py-16 space-y-20">
        <section>
          <SectionTitle eyebrow="01" title="Hommes" />
          <SizeTable
            columns={["Taille", "Stature", "Longueur du maillot", "1/2 tour de poitrine"]}
            rows={HOMMES.map((r) => [r.size, r.height, r.length, r.chest])}
          />
        </section>

        <section>
          <SectionTitle eyebrow="02" title="Femmes" />
          <SizeTable
            columns={["Taille", "Stature", "Longueur du maillot", "1/2 poitrine", "1/2 taille", "1/2 hanches"]}
            rows={FEMMES.map((r) => [r.size, r.height, r.length, r.bust, r.waist, r.hips])}
          />
        </section>

        <section>
          <SectionTitle eyebrow="03" title="Enfants" sub="2 à 13 ans" />
          <SizeTable
            columns={["Taille", "Âge", "Stature", "Longueur maillot", "1/2 poitrine", "Longueur pantalon", "1/2 tour de taille"]}
            rows={ENFANTS.map((r) => [r.size, r.age, r.height, r.length, r.chest, r.pant, r.waist])}
          />
        </section>

        <section className="border-y border-neutral-200 py-10">
          <div className="text-[10px] uppercase tracking-[0.2em] text-psg-red font-mono">Comment mesurer ?</div>
          <h2 className="text-2xl font-black mt-3">Bien choisir sa taille</h2>
          <ul className="mt-6 space-y-4 text-sm text-neutral-700 leading-relaxed">
            <li>
              <strong className="block font-semibold text-neutral-900">Longueur du maillot</strong>
              Mesurez du haut de l&apos;épaule jusqu&apos;au bas du maillot, sans tendre le tissu.
            </li>
            <li>
              <strong className="block font-semibold text-neutral-900">1/2 tour de poitrine</strong>
              Mesurez la largeur du maillot à plat, juste sous les manches. Multipliez par 2 pour obtenir le tour complet.
            </li>
            <li>
              <strong className="block font-semibold text-neutral-900">Stature</strong>
              Votre taille debout en centimètres. C&apos;est la donnée la plus simple à utiliser pour choisir rapidement.
            </li>
            <li>
              <strong className="block font-semibold text-neutral-900">Hésitation entre deux tailles</strong>
              Coupe replica = ample, prenez votre taille habituelle. Coupe authentique (player issue) = ajustée,
              prenez la taille au-dessus si vous préférez du confort.
            </li>
          </ul>
        </section>

        <section className="text-center">
          <p className="text-sm text-neutral-500">
            Une question sur votre commande ou un doute sur la taille ?
          </p>
          <Link
            href="/contact"
            className="inline-block mt-3 text-sm font-semibold underline underline-offset-4 hover:text-psg-red"
          >
            Contactez-nous →
          </Link>
        </section>
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-neutral-200 pb-4">
      <div>
        <div className="text-xs font-mono text-psg-red tracking-widest">{eyebrow}</div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-2">{title}</h2>
      </div>
      {sub && <span className="text-xs uppercase tracking-widest text-neutral-400">{sub}</span>}
    </div>
  );
}

function SizeTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[640px]">
        <thead>
          <tr className="border-b-2 border-neutral-900">
            {columns.map((c, i) => (
              <th
                key={c}
                className={`text-left py-3 px-3 text-[11px] uppercase tracking-widest font-bold ${
                  i === 0 ? "w-24" : ""
                }`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-b border-neutral-200 hover:bg-neutral-50">
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={`py-4 px-3 ${i === 0 ? "font-bold text-base text-psg-blue" : "text-neutral-700"} tabular-nums`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
