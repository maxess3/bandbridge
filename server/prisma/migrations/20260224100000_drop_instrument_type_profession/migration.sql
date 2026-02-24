-- AlterTable: remove deprecated profession column from InstrumentType
ALTER TABLE "InstrumentType" DROP COLUMN IF EXISTS "profession";
