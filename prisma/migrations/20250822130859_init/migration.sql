-- CreateTable
CREATE TABLE `dealers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dealers_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_schedules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `schedule_date` DATE NOT NULL,
    `quota` INTEGER NOT NULL,
    `dealer_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_statuses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_bookings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `phone_no` VARCHAR(20) NOT NULL,
    `vehicle_type` VARCHAR(100) NOT NULL,
    `license_plate` VARCHAR(20) NOT NULL,
    `vehicle_problem` TEXT NOT NULL,
    `service_schedule_id` INTEGER NOT NULL,
    `service_time` VARCHAR(50) NOT NULL,
    `service_status_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `service_schedules` ADD CONSTRAINT `service_schedules_dealer_id_fkey` FOREIGN KEY (`dealer_id`) REFERENCES `dealers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_bookings` ADD CONSTRAINT `service_bookings_service_schedule_id_fkey` FOREIGN KEY (`service_schedule_id`) REFERENCES `service_schedules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_bookings` ADD CONSTRAINT `service_bookings_service_status_id_fkey` FOREIGN KEY (`service_status_id`) REFERENCES `service_statuses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
