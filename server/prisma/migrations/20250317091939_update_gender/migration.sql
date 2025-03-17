/*
  Warnings:

  - The values [Male,Female,Other] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Gender_new" AS ENUM ('MALE', 'FEMALE', 'OTHER');
ALTER TABLE "Profile" ALTER COLUMN "gender" DROP DEFAULT;
ALTER TABLE "Profile" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TYPE "Gender" RENAME TO "Gender_old";
ALTER TYPE "Gender_new" RENAME TO "Gender";
DROP TYPE "Gender_old";
ALTER TABLE "Profile" ALTER COLUMN "gender" SET DEFAULT 'OTHER';
COMMIT;

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "gender" SET DEFAULT 'OTHER';
