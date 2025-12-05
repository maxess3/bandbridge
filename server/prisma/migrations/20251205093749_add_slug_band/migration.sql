/*
  Warnings:

  - You are about to alter the column `title` on the `BandHiringAd` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - A unique constraint covering the columns `[slug]` on the table `Band` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Band` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Band" ADD COLUMN     "profilePictureKey" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BandHiringAd" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "BandRequiredSlot" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "hiringAdId" TEXT NOT NULL,
    "instrumentTypeId" TEXT NOT NULL,

    CONSTRAINT "BandRequiredSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BandRequiredSlot_hiringAdId_instrumentTypeId_key" ON "BandRequiredSlot"("hiringAdId", "instrumentTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Band_slug_key" ON "Band"("slug");

-- AddForeignKey
ALTER TABLE "BandRequiredSlot" ADD CONSTRAINT "BandRequiredSlot_hiringAdId_fkey" FOREIGN KEY ("hiringAdId") REFERENCES "BandHiringAd"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BandRequiredSlot" ADD CONSTRAINT "BandRequiredSlot_instrumentTypeId_fkey" FOREIGN KEY ("instrumentTypeId") REFERENCES "InstrumentType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
