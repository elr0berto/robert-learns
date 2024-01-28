/*
  Warnings:

  - Made the column `userId` on table `Drill` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Drill` DROP FOREIGN KEY `Drill_userId_fkey`;

-- AlterTable
ALTER TABLE `Drill` MODIFY `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Drill` ADD CONSTRAINT `Drill_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
