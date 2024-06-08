-- CreateTable
CREATE TABLE `CardSetLink` (
    `parentCardSetId` INTEGER NOT NULL,
    `includedCardSetId` INTEGER NOT NULL,

    PRIMARY KEY (`parentCardSetId`, `includedCardSetId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CardSetLink` ADD CONSTRAINT `CardSetLink_parentCardSetId_fkey` FOREIGN KEY (`parentCardSetId`) REFERENCES `CardSet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CardSetLink` ADD CONSTRAINT `CardSetLink_includedCardSetId_fkey` FOREIGN KEY (`includedCardSetId`) REFERENCES `CardSet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
