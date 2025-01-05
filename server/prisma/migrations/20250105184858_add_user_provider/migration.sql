-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('MANUAL', 'GOOGLE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provider" "Provider" NOT NULL DEFAULT 'MANUAL';
