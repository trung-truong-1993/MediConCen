-- CreateTable
CREATE TABLE `user_mappings` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `id1` VARCHAR(191) NOT NULL,
    `id2` VARCHAR(191) NOT NULL,
    `userId` CHAR(36) NOT NULL,

    UNIQUE INDEX `user_mappings_id1_id2_key`(`id1`, `id2`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
