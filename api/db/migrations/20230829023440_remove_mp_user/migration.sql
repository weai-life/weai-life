/*
  Warnings:

  - You are about to drop the `MpUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MpUser" DROP CONSTRAINT "MpUser_groupId_fkey";

-- DropForeignKey
ALTER TABLE "MpUser" DROP CONSTRAINT "MpUser_userId_fkey";

-- DropTable
DROP TABLE "MpUser";
