-- CreateEnum
CREATE TYPE "RehearsalFrequency" AS ENUM ('NOT_SPECIFIED', 'ONCE_PER_WEEK', 'TWO_TO_THREE_PER_WEEK', 'MORE_THAN_THREE_PER_WEEK');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "rehearsalsPerWeek" "RehearsalFrequency" NOT NULL DEFAULT 'NOT_SPECIFIED';
