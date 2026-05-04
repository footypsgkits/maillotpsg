/*
  Warnings:

  - You are about to drop the column `season` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN "longContent" TEXT;

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "number" INTEGER,
    "position" TEXT,
    "nationality" TEXT,
    "era" TEXT NOT NULL DEFAULT 'actuel',
    "bio" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "imageUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "position2" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProductPlayer" (
    "productId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    PRIMARY KEY ("productId", "playerId"),
    CONSTRAINT "ProductPlayer_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "era" TEXT NOT NULL DEFAULT 'actuelle',
    "shirtMaker" TEXT,
    "description" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "imageUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Guide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "keywords" TEXT,
    "imageUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT,
    "price" REAL NOT NULL,
    "oldPrice" REAL,
    "sku" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "seasonLabel" TEXT,
    "team" TEXT NOT NULL DEFAULT 'PSG',
    "kind" TEXT NOT NULL DEFAULT 'domicile',
    "gender" TEXT NOT NULL DEFAULT 'homme',
    "flockingAvailable" BOOLEAN NOT NULL DEFAULT true,
    "flockingPrice" REAL NOT NULL DEFAULT 15,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "keywords" TEXT,
    "ratingValue" REAL,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT NOT NULL,
    "seasonId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("active", "categoryId", "createdAt", "description", "featured", "flockingAvailable", "flockingPrice", "gender", "id", "keywords", "kind", "metaDesc", "metaTitle", "name", "oldPrice", "price", "shortDescription", "sku", "slug", "stock", "team", "updatedAt") SELECT "active", "categoryId", "createdAt", "description", "featured", "flockingAvailable", "flockingPrice", "gender", "id", "keywords", "kind", "metaDesc", "metaTitle", "name", "oldPrice", "price", "shortDescription", "sku", "slug", "stock", "team", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX "Product_active_idx" ON "Product"("active");
CREATE INDEX "Product_seasonId_idx" ON "Product"("seasonId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Player_slug_key" ON "Player"("slug");

-- CreateIndex
CREATE INDEX "ProductPlayer_playerId_idx" ON "ProductPlayer"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "Season_slug_key" ON "Season"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Guide_slug_key" ON "Guide"("slug");
