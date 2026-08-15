-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "signLanguage" TEXT,
ADD COLUMN     "passwordResetTokenHash" TEXT,
ADD COLUMN     "passwordResetTokenExpiresAt" TIMESTAMP(3);
