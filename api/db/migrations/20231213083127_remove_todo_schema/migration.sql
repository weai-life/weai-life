/*
  Warnings:

  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TodoToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_postId_fkey";

-- DropForeignKey
ALTER TABLE "Todo" DROP CONSTRAINT "Todo_userId_fkey";

-- DropForeignKey
ALTER TABLE "_TodoToUser" DROP CONSTRAINT "_TodoToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_TodoToUser" DROP CONSTRAINT "_TodoToUser_B_fkey";

-- DropTable
DROP TABLE "Todo";

-- DropTable
DROP TABLE "_TodoToUser";
