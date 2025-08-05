/*
  Warnings:

  - The values [PROFESSIONAL] on the enum `InstrumentLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InstrumentLevel_new" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
ALTER TABLE "Instrument" ALTER COLUMN "level" TYPE "InstrumentLevel_new" USING ("level"::text::"InstrumentLevel_new");
ALTER TYPE "InstrumentLevel" RENAME TO "InstrumentLevel_old";
ALTER TYPE "InstrumentLevel_new" RENAME TO "InstrumentLevel";
DROP TYPE "InstrumentLevel_old";
COMMIT;
