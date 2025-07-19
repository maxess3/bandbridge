/*
  Warnings:

  - You are about to drop the column `experienceYears` on the `Instrument` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InstrumentLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL');

-- AlterTable
ALTER TABLE "Instrument" DROP COLUMN "experienceYears",
ADD COLUMN     "level" "InstrumentLevel" NOT NULL DEFAULT 'BEGINNER';
