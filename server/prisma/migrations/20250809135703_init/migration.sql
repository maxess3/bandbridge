-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('MANUAL', 'GOOGLE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProfileRole" AS ENUM ('MUSICIAN', 'PROFESSIONAL', 'TALENT_SCOUT');

-- CreateEnum
CREATE TYPE "MusicGenre" AS ENUM ('ROCK', 'JAZZ', 'ELECTRO', 'POP', 'FOLK', 'BLUES', 'HIP_HOP', 'RAP', 'R_AND_B', 'METAL', 'PUNK', 'COUNTRY', 'REGGAE', 'FUNK', 'SOUL', 'ALTERNATIVE', 'INDIE', 'ACOUSTIC', 'LATINO', 'CLASSICAL', 'CELTIC', 'SKA', 'LOUNGE', 'RELIGIOUS', 'OTHER');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('YOUTUBE', 'INSTAGRAM', 'TIKTOK', 'TWITTER', 'SOUNDCLOUD');

-- CreateEnum
CREATE TYPE "ConcertCount" AS ENUM ('NOT_SPECIFIED', 'LESS_THAN_10', 'TEN_TO_FIFTY', 'FIFTY_TO_HUNDRED', 'MORE_THAN_HUNDRED');

-- CreateEnum
CREATE TYPE "RehearsalFrequency" AS ENUM ('NOT_SPECIFIED', 'ONCE_PER_WEEK', 'TWO_TO_THREE_PER_WEEK', 'MORE_THAN_THREE_PER_WEEK');

-- CreateEnum
CREATE TYPE "PracticeType" AS ENUM ('NOT_SPECIFIED', 'HOBBY', 'ACTIVE');

-- CreateEnum
CREATE TYPE "InstrumentLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "InstrumentCategory" AS ENUM ('STRINGS', 'WIND', 'PERCUSSION', 'KEYBOARD', 'ELECTRONIC', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "provider" "Provider" NOT NULL DEFAULT 'MANUAL',
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "password_changed_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'OTHER',
    "username" TEXT,
    "firstName" VARCHAR(60) NOT NULL,
    "lastName" VARCHAR(60) NOT NULL,
    "birthDate" DATE,
    "country" TEXT,
    "city" TEXT,
    "zipCode" TEXT,
    "role" "ProfileRole" NOT NULL DEFAULT 'MUSICIAN',
    "genres" "MusicGenre"[],
    "lastActiveAt" TIMESTAMP(3),
    "profilePictureKey" TEXT,
    "description" TEXT,
    "concertsPlayed" "ConcertCount" NOT NULL DEFAULT 'NOT_SPECIFIED',
    "rehearsalsPerWeek" "RehearsalFrequency" NOT NULL DEFAULT 'NOT_SPECIFIED',
    "practiceType" "PracticeType" NOT NULL DEFAULT 'NOT_SPECIFIED',
    "userId" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstrumentType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "InstrumentCategory" NOT NULL,
    "profession" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstrumentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instrument" (
    "id" TEXT NOT NULL,
    "level" "InstrumentLevel",
    "order" INTEGER NOT NULL DEFAULT 0,
    "profileId" TEXT NOT NULL,
    "instrumentTypeId" TEXT NOT NULL,

    CONSTRAINT "Instrument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "url" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Band" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Band_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "department" VARCHAR(60) NOT NULL,
    "city" VARCHAR(60) NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "country" VARCHAR(60) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserFollows" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserFollows_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BandToProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BandToProfile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "Profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InstrumentType_name_key" ON "InstrumentType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Instrument_profileId_instrumentTypeId_key" ON "Instrument"("profileId", "instrumentTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "SocialLink_platform_profileId_key" ON "SocialLink"("platform", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Band_name_key" ON "Band"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Post_user_id_title_key" ON "Post"("user_id", "title");

-- CreateIndex
CREATE INDEX "_UserFollows_B_index" ON "_UserFollows"("B");

-- CreateIndex
CREATE INDEX "_BandToProfile_B_index" ON "_BandToProfile"("B");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instrument" ADD CONSTRAINT "Instrument_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instrument" ADD CONSTRAINT "Instrument_instrumentTypeId_fkey" FOREIGN KEY ("instrumentTypeId") REFERENCES "InstrumentType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialLink" ADD CONSTRAINT "SocialLink_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollows" ADD CONSTRAINT "_UserFollows_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollows" ADD CONSTRAINT "_UserFollows_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BandToProfile" ADD CONSTRAINT "_BandToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "Band"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BandToProfile" ADD CONSTRAINT "_BandToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
