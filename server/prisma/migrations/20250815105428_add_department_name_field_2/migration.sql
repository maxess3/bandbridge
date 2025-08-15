/*
  Warnings:

  - You are about to alter the column `departmentName` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "departmentName" SET DATA TYPE VARCHAR(100);
