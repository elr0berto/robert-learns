/*
  Warnings:

  - You are about to drop the column `cardSetId` on the `Media` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Media` DROP FOREIGN KEY `Media_cardSetId_fkey`;

-- AlterTable
ALTER TABLE `Media` DROP COLUMN `cardSetId`;
