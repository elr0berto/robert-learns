-- CreateTable
CREATE TABLE `WorkspaceUserInvite` (
    `email` VARCHAR(191) NOT NULL,
    `workspaceId` INTEGER NOT NULL,
    `role` ENUM('OWNER', 'ADMINISTRATOR', 'CONTRIBUTOR', 'USER') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NULL,

    PRIMARY KEY (`workspaceId`, `email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorkspaceUserInvite` ADD CONSTRAINT `WorkspaceUserInvite_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
