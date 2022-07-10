/*
  Warnings:

  - Added the required column `workspaceId` to the `CardSet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CardSet` ADD COLUMN `workspaceId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `CardSet` ADD CONSTRAINT `CardSet_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
