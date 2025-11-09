-- AlterTable
ALTER TABLE `Hospital` ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `state` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Hospital_state_idx` ON `Hospital`(`state`);

-- CreateIndex
CREATE INDEX `Hospital_city_idx` ON `Hospital`(`city`);
