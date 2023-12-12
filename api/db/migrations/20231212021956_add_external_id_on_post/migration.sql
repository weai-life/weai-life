-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "externalId" TEXT;

-- CreateIndex
CREATE INDEX "Post_externalId_idx" ON "Post"("externalId");
