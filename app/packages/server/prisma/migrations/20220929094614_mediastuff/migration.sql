/*
  Warnings:

  - Added the required column `audioId` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaId` to the `CardFace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Card` ADD COLUMN `audioId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `CardFace` ADD COLUMN `mediaId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` MEDIUMTEXT NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('AUDIO', 'IMAGE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Card` ADD CONSTRAINT `Card_audioId_fkey` FOREIGN KEY (`audioId`) REFERENCES `Media`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CardFace` ADD CONSTRAINT `CardFace_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `Media`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
