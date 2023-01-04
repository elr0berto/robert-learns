/*
  Warnings:

  - You are about to drop the column `mediaId` on the `CardFace` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `CardFace` DROP FOREIGN KEY `CardFace_mediaId_fkey`;

-- AlterTable
ALTER TABLE `CardFace` DROP COLUMN `mediaId`;
