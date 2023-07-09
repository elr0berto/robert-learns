-- CreateTable
CREATE TABLE `Logs` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `level` TEXT NOT NULL,
    `message` TEXT NOT NULL,
    `meta` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
