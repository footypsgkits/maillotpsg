# Maillot-PSG — Boutique en ligne maillots PSG

Site e-commerce spécialisé maillots Paris Saint-Germain : domicile, extérieur, third, gardien, training, rétro, enfant. Floquage personnalisé, SEO optimisé.

## Stack

- **Next.js 16** (App Router, Turbopack, Server Components)
- **Prisma 7** + **SQLite** (driver adapter `better-sqlite3`)
- **Tailwind CSS 4**
- **TypeScript** strict
- **Zod** pour la validation
- Auth admin par cookie HMAC (Web Crypto)

## Installation

```bash
npm install
cp .env.example .env   # puis éditer ADMIN_PASSWORD et ADMIN_SECRET
npx prisma migrate dev
npm run db:seed        # seed les 8 catégories par défaut
npm run dev
```

Front public : http://localhost:3000
Admin : http://localhost:3000/admin (mdp défini dans `.env`, `psg2026` par défaut)

## Variables d'environnement

```
DATABASE_URL="file:./prisma/dev.db"
ADMIN_PASSWORD="psg2026"
ADMIN_SECRET="long-random-string"
NEXT_PUBLIC_SITE_URL="https://maillot-psg.fr"
```

## Scripts

```bash
npm run dev         # serveur de dev
npm run build       # build prod (lance migrate + generate)
npm run start       # serveur prod
npm run db:migrate  # créer une migration
npm run db:seed     # seed des catégories
npm run db:studio   # Prisma Studio
```

## Structure

```
src/
├── app/
│   ├── page.tsx                 home + bloc SEO long
│   ├── maillots/                liste + pages catégories
│   ├── produit/[slug]/          page produit (JSON-LD Product)
│   ├── panier/                  panier + checkout
│   ├── admin/
│   │   ├── login/               connexion
│   │   └── (panel)/             dashboard, produits CRUD, catégories, commandes
│   ├── api/
│   │   ├── admin/               routes CRUD protégées (proxy.ts)
│   │   └── checkout/            création de commande
│   ├── sitemap.ts               sitemap dynamique
│   └── robots.ts
├── components/
│   ├── ProductCard.tsx
│   ├── ProductBuyForm.tsx       sélection taille + floquage
│   ├── CartView.tsx
│   └── admin/
│       ├── ProductForm.tsx      formulaire produit complet
│       └── CategoriesAdmin.tsx
├── lib/
│   ├── db.ts                    Prisma + driver adapter SQLite
│   ├── auth.ts                  HMAC Web Crypto
│   ├── cart.ts                  panier localStorage côté client
│   ├── seo.ts                   helpers JSON-LD
│   └── utils.ts                 tailles, slug, formatPrice
└── proxy.ts                     auth gate sur /admin/* et /api/admin/*
```

## SEO

- Metadata dynamique sur produits & catégories (titre, description, OG, canonical, keywords)
- JSON-LD : `Organization`, `WebSite`, `Product`, `BreadcrumbList`
- `sitemap.xml` dynamique (catégories + produits actifs)
- `robots.txt` (admin/api/panier exclus)
- Bloc texte SEO sur la home, slugs FR-friendly
- Champs SEO override par produit et catégorie depuis l'admin

## Floquage personnalisé

Activable produit par produit. Le client saisit nom (max 12 caractères) + numéro (1-2 chiffres) au panier. Stocké dans `OrderItem.flockingName` / `flockingNumber`.

## Tailles

- **Adulte** : XS, S, M, L, XL, XXL, 3XL
- **Enfant** : 4 ans, 6 ans, 8 ans, 10 ans, 12 ans, 14 ans, 16 ans

Stock géré individuellement par taille (`ProductSize`). Les tailles en rupture s'affichent barrées sur la fiche produit.

## Production / Vercel

Pour passer en Postgres Vercel (recommandé en prod sur Vercel, SQLite n'est pas adapté à Fluid Compute) :

1. Provisionner Neon Postgres via Vercel Marketplace
2. Changer `provider = "postgresql"` dans `prisma/schema.prisma`
3. Remplacer le driver adapter `@prisma/adapter-better-sqlite3` par `@prisma/adapter-pg`
4. Mettre `DATABASE_URL` dans Vercel env
5. Déployer

Pour les uploads d'images en production, remplacer le stockage filesystem (`/public/uploads`) par **Vercel Blob** dans `src/app/api/admin/upload/route.ts`.
