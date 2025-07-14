/*
  Warnings:

  - You are about to drop the column `name` on the `Instrument` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profileId,instrumentTypeId]` on the table `Instrument` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `instrumentTypeId` to the `Instrument` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InstrumentCategory" AS ENUM ('STRINGS', 'WIND', 'PERCUSSION', 'KEYBOARD', 'ELECTRONIC', 'OTHER');

-- AlterTable
ALTER TABLE "Instrument" DROP COLUMN "name",
ADD COLUMN     "instrumentTypeId" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "InstrumentType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "InstrumentCategory" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstrumentType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstrumentType_name_key" ON "InstrumentType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Instrument_profileId_instrumentTypeId_key" ON "Instrument"("profileId", "instrumentTypeId");

-- AddForeignKey
ALTER TABLE "Instrument" ADD CONSTRAINT "Instrument_instrumentTypeId_fkey" FOREIGN KEY ("instrumentTypeId") REFERENCES "InstrumentType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
