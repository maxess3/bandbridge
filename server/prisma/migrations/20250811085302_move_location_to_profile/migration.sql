/*
  Warnings:

  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable: Ajouter les colonnes de localisation au modèle Profile
ALTER TABLE "Profile" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "zipCode" TEXT;

-- Copier les données de localisation du modèle User vers le modèle Profile
UPDATE "Profile"
SET
    "country" = u."country",
    "city" = u."city",
    "zipCode" = u."zipCode"
FROM "User" u
WHERE "Profile"."userId" = u.id;

-- AlterTable: Supprimer les colonnes de localisation du modèle User
ALTER TABLE "User" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "zipCode";
