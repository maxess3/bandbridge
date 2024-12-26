/*
  Warnings:

  - You are about to drop the column `isOnline` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isOnline",
DROP COLUMN "name",
DROP COLUMN "phone",
ADD COLUMN     "firstName" VARCHAR(60) NOT NULL,
ADD COLUMN     "lastName" VARCHAR(60) NOT NULL;
