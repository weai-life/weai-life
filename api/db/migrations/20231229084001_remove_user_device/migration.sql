/*
  Warnings:

  - You are about to drop the `UserDevice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserDevice" DROP CONSTRAINT "UserDevice_userId_fkey";

-- DropTable
DROP TABLE "UserDevice";
