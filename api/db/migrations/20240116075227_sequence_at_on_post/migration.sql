/*
  Warnings:

  - You are about to drop the column `happenedAt` on the `Post` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Post_happenedAt_idx";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "happenedAt",
ADD COLUMN     "sequenceAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Post_sequenceAt_idx" ON "Post"("sequenceAt");
