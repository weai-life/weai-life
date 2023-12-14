/*
  Warnings:

  - You are about to drop the column `templateId` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the `Page` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Template` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_templateId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_channelId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_templateId_fkey";

-- DropForeignKey
ALTER TABLE "Template" DROP CONSTRAINT "Template_userId_fkey";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "templateId";

-- DropTable
DROP TABLE "Page";

-- DropTable
DROP TABLE "Template";
