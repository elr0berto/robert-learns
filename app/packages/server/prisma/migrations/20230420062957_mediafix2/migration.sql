/*
  Warnings:

  - Added the required column `workspaceId` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Media` ADD COLUMN `workspaceId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
