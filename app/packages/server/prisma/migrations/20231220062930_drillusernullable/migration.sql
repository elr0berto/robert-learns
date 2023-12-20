-- DropForeignKey
ALTER TABLE `Drill` DROP FOREIGN KEY `Drill_userId_fkey`;

-- AlterTable
ALTER TABLE `Drill` MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Drill` ADD CONSTRAINT `Drill_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
