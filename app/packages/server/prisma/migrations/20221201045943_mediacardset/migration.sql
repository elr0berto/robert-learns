-- AlterTable
ALTER TABLE `Media` ADD COLUMN `cardSetId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_cardSetId_fkey` FOREIGN KEY (`cardSetId`) REFERENCES `CardSet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
