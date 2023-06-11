/*
  Warnings:

  - You are about to drop the column `isGuest` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `isGuest`;

-- AlterTable
ALTER TABLE `Workspace` ADD COLUMN `allowGuests` BOOLEAN NOT NULL DEFAULT false;
