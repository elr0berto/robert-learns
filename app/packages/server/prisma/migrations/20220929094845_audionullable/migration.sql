-- DropForeignKey
ALTER TABLE `Card` DROP FOREIGN KEY `Card_audioId_fkey`;

-- AlterTable
ALTER TABLE `Card` MODIFY `audioId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Card` ADD CONSTRAINT `Card_audioId_fkey` FOREIGN KEY (`audioId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
