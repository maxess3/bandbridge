-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- Insert Role from distinct InstrumentType.profession
INSERT INTO "Role" ("id", "name", "createdAt", "updatedAt")
SELECT gen_random_uuid(), "profession", NOW(), NOW()
FROM (SELECT DISTINCT "profession" FROM "InstrumentType" WHERE "profession" IS NOT NULL) AS t;

-- AlterTable InstrumentType: add roleId
ALTER TABLE "InstrumentType" ADD COLUMN "roleId" TEXT;

-- Backfill InstrumentType.roleId from Role where name = profession
UPDATE "InstrumentType" it
SET "roleId" = r."id"
FROM "Role" r
WHERE r."name" = it."profession" AND it."profession" IS NOT NULL;

-- AlterTable BandHiringAd: add new columns
ALTER TABLE "BandHiringAd" ADD COLUMN IF NOT EXISTS "rehearsalsPerWeek" "RehearsalFrequency";
ALTER TABLE "BandHiringAd" ADD COLUMN IF NOT EXISTS "country" VARCHAR(60);
ALTER TABLE "BandHiringAd" ADD COLUMN IF NOT EXISTS "city" VARCHAR(60);
ALTER TABLE "BandHiringAd" ADD COLUMN IF NOT EXISTS "zipCode" VARCHAR(10);
ALTER TABLE "BandHiringAd" ADD COLUMN IF NOT EXISTS "departmentName" VARCHAR(60);

-- AlterTable BandRequiredSlot: add roleId (nullable first)
ALTER TABLE "BandRequiredSlot" ADD COLUMN "roleId" TEXT;

-- Backfill BandRequiredSlot.roleId from InstrumentType.roleId
UPDATE "BandRequiredSlot" brs
SET "roleId" = it."roleId"
FROM "InstrumentType" it
WHERE it."id" = brs."instrumentTypeId" AND it."roleId" IS NOT NULL;

-- Remove slots that cannot be mapped to a role (instrument type had no profession)
DELETE FROM "BandRequiredSlot" WHERE "roleId" IS NULL;

-- Drop old FK and unique, drop instrumentTypeId
ALTER TABLE "BandRequiredSlot" DROP CONSTRAINT IF EXISTS "BandRequiredSlot_instrumentTypeId_fkey";
DROP INDEX IF EXISTS "BandRequiredSlot_hiringAdId_instrumentTypeId_key";
ALTER TABLE "BandRequiredSlot" DROP COLUMN "instrumentTypeId";

-- Make roleId NOT NULL and add FK + unique
ALTER TABLE "BandRequiredSlot" ALTER COLUMN "roleId" SET NOT NULL;
CREATE UNIQUE INDEX "BandRequiredSlot_hiringAdId_roleId_key" ON "BandRequiredSlot"("hiringAdId", "roleId");
ALTER TABLE "BandRequiredSlot" ADD CONSTRAINT "BandRequiredSlot_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add FK from InstrumentType to Role
ALTER TABLE "InstrumentType" ADD CONSTRAINT "InstrumentType_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
