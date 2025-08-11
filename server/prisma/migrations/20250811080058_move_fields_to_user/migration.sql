/*
  Warnings:

  - You are about to drop the column `birthDate` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the `User` table will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/

-- First, add the new columns to User table (nullable initially)
ALTER TABLE "User" ADD COLUMN     "birthDate" DATE,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "firstName" VARCHAR(60),
ADD COLUMN     "gender" "Gender" DEFAULT 'OTHER',
ADD COLUMN     "lastName" VARCHAR(60),
ADD COLUMN     "username" TEXT,
ADD COLUMN     "zipCode" TEXT;

-- Copy data from Profile to User
UPDATE "User" 
SET 
    "firstName" = p."firstName",
    "lastName" = p."lastName",
    "username" = p."username",
    "gender" = p."gender",
    "country" = p."country",
    "city" = p."city",
    "zipCode" = p."zipCode",
    "birthDate" = p."birthDate"
FROM "Profile" p
WHERE "User".id = p."userId";

-- Now make firstName and lastName NOT NULL
ALTER TABLE "User" ALTER COLUMN "firstName" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "lastName" SET NOT NULL;

-- DropIndex
DROP INDEX "Profile_username_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "birthDate",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "firstName",
DROP COLUMN "gender",
DROP COLUMN "lastName",
DROP COLUMN "username",
DROP COLUMN "zipCode";

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
