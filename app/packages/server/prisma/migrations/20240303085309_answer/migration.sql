-- CreateTable
CREATE TABLE `DrillRunQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `drillRunId` INTEGER NOT NULL,
    `cardId` INTEGER NOT NULL,
    `correct` BOOLEAN NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DrillRunQuestion` ADD CONSTRAINT `DrillRunQuestion_drillRunId_fkey` FOREIGN KEY (`drillRunId`) REFERENCES `DrillRun`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DrillRunQuestion` ADD CONSTRAINT `DrillRunQuestion_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
