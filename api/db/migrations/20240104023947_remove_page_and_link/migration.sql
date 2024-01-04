/*
  Warnings:

  - You are about to drop the `Link` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Page` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_pageId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_ownerId_fkey";

-- DropTable
DROP TABLE "Link";

-- DropTable
DROP TABLE "Page";
