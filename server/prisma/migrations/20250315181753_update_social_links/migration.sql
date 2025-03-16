/*
  Warnings:

  - A unique constraint covering the columns `[platform,profileId]` on the table `SocialLink` will be added. If there are existing duplicate values, this will fail.
  - Made the column `platform` on table `SocialLink` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Platform" ADD VALUE 'TIKTOK';
ALTER TYPE "Platform" ADD VALUE 'TWITTER';

-- DropForeignKey
ALTER TABLE "SocialLink" DROP CONSTRAINT "SocialLink_profileId_fkey";

-- AlterTable
ALTER TABLE "SocialLink" ALTER COLUMN "platform" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SocialLink_platform_profileId_key" ON "SocialLink"("platform", "profileId");

-- AddForeignKey
ALTER TABLE "SocialLink" ADD CONSTRAINT "SocialLink_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
