/*
  Warnings:

  - You are about to drop the column `groupId` on the `Link` table. All the data in the column will be lost.
  - Added the required column `pageId` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_groupId_fkey";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "groupId",
ADD COLUMN     "pageId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Page" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "avatarUrl" TEXT,
    "ownerId" INTEGER NOT NULL,
    "store" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
