-- AlterTable
DROP INDEX IF EXISTS "Band_slug_key";
ALTER TABLE "Band" DROP COLUMN IF EXISTS "slug";
