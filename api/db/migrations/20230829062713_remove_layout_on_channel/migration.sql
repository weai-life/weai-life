/*
  Warnings:

  - You are about to drop the column `layout` on the `Channel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "layout";

-- DropEnum
DROP TYPE "ContentFormat";

-- DropEnum
DROP TYPE "Layout";
