/*
  Warnings:

  - You are about to drop the column `yearStarted` on the `Instrument` table. All the data in the column will be lost.
  - Added the required column `experienceYears` to the `Instrument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Instrument" DROP COLUMN "yearStarted",
ADD COLUMN     "experienceYears" INTEGER NOT NULL;
