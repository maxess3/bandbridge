-- CreateEnum
CREATE TYPE "PracticeType" AS ENUM ('NOT_SPECIFIED', 'HOBBY', 'ACTIVE');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "practiceType" "PracticeType" NOT NULL DEFAULT 'NOT_SPECIFIED';
