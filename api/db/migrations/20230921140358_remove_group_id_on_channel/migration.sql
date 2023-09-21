/*
  Warnings:

  - You are about to drop the column `groupId` on the `Channel` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_groupId_fkey";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "groupId";
