-- AlterTable
ALTER TABLE `CardSetUser` MODIFY `role` ENUM('OWNER', 'ADMINISTRATOR', 'CONTRIBUTOR', 'USER') NOT NULL;

-- AlterTable
ALTER TABLE `WorkspaceUser` MODIFY `role` ENUM('OWNER', 'ADMINISTRATOR', 'CONTRIBUTOR', 'USER') NOT NULL;
