/*
  Warnings:

  - A unique constraint covering the columns `[subscriptionId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "RateType" AS ENUM ('HOURLY', 'FIXED', 'NEGOTIABLE');

-- CreateEnum
CREATE TYPE "MembershipTier" AS ENUM ('FREE', 'PRO', 'ELITE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED', 'INACTIVE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "education" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "hourlyRate" DECIMAL(10,2),
ADD COLUMN     "languages" JSONB,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "membershipTier" "MembershipTier" NOT NULL DEFAULT 'FREE',
ADD COLUMN     "portfolioUrl" TEXT,
ADD COLUMN     "professionalTitle" TEXT,
ADD COLUMN     "rateType" "RateType" NOT NULL DEFAULT 'NEGOTIABLE',
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "subscriptionEndsAt" TIMESTAMP(3),
ADD COLUMN     "subscriptionId" TEXT,
ADD COLUMN     "subscriptionStatus" "SubscriptionStatus" DEFAULT 'INACTIVE',
ADD COLUMN     "yearsOfExperience" INTEGER DEFAULT 0;

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "participantAId" TEXT NOT NULL,
    "participantBId" TEXT NOT NULL,
    "deletedByA" BOOLEAN NOT NULL DEFAULT false,
    "deletedByB" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "senderId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_participantAId_participantBId_key" ON "Conversation"("participantAId", "participantBId");

-- CreateIndex
CREATE UNIQUE INDEX "User_subscriptionId_key" ON "User"("subscriptionId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_participantAId_fkey" FOREIGN KEY ("participantAId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_participantBId_fkey" FOREIGN KEY ("participantBId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
