/*
  Warnings:

  - You are about to drop the `_BandToProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BandMemberRole" AS ENUM ('MEMBER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "_BandToProfile" DROP CONSTRAINT "_BandToProfile_A_fkey";

-- DropForeignKey
ALTER TABLE "_BandToProfile" DROP CONSTRAINT "_BandToProfile_B_fkey";

-- DropTable
DROP TABLE "_BandToProfile";

-- CreateTable
CREATE TABLE "BandMember" (
    "id" TEXT NOT NULL,
    "bandId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "role" "BandMemberRole" NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "BandMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BandMember_bandId_profileId_key" ON "BandMember"("bandId", "profileId");

-- AddForeignKey
ALTER TABLE "BandMember" ADD CONSTRAINT "BandMember_bandId_fkey" FOREIGN KEY ("bandId") REFERENCES "Band"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BandMember" ADD CONSTRAINT "BandMember_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
