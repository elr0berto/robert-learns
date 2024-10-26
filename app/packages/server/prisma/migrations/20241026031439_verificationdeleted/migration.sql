-- AlterTable
ALTER TABLE `EmailVerificationToken` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;
