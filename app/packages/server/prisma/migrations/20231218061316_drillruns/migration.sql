-- CreateTable
CREATE TABLE `Drill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL DEFAULT '',
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DrillCardSet` (
    `drillId` INTEGER NOT NULL,
    `cardSetId` INTEGER NOT NULL,

    PRIMARY KEY (`drillId`, `cardSetId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DrillRun` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `drillId` INTEGER NOT NULL,
    `startTime` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `endTime` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Drill` ADD CONSTRAINT `Drill_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DrillCardSet` ADD CONSTRAINT `DrillCardSet_drillId_fkey` FOREIGN KEY (`drillId`) REFERENCES `Drill`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DrillCardSet` ADD CONSTRAINT `DrillCardSet_cardSetId_fkey` FOREIGN KEY (`cardSetId`) REFERENCES `CardSet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DrillRun` ADD CONSTRAINT `DrillRun_drillId_fkey` FOREIGN KEY (`drillId`) REFERENCES `Drill`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
