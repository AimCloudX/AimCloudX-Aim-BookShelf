/*
  Warnings:

  - You are about to drop the `_AuthorToBook` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `BookInstance` DROP FOREIGN KEY `BookInstance_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `_AuthorToBook` DROP FOREIGN KEY `_AuthorToBook_A_fkey`;

-- DropForeignKey
ALTER TABLE `_AuthorToBook` DROP FOREIGN KEY `_AuthorToBook_B_fkey`;

-- DropIndex
DROP INDEX `BookInstance_bookId_fkey` ON `BookInstance`;

-- DropIndex
DROP INDEX `Review_bookId_fkey` ON `Review`;

-- DropTable
DROP TABLE `_AuthorToBook`;

-- CreateTable
CREATE TABLE `BookAuthor` (
    `bookId` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`bookId`, `authorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BookAuthor` ADD CONSTRAINT `BookAuthor_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookAuthor` ADD CONSTRAINT `BookAuthor_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `Author`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookInstance` ADD CONSTRAINT `BookInstance_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
