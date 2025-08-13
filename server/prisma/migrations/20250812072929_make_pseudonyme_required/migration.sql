/*
  Warnings:

  - Made the column `pseudonyme` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- Update existing NULL values with a default value
UPDATE "Profile" SET "pseudonyme" = 'Artiste' WHERE "pseudonyme" IS NULL;

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "pseudonyme" SET NOT NULL;
