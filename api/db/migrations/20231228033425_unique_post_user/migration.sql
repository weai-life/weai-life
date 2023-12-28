/*
  Warnings:

  - A unique constraint covering the columns `[postId,userId]` on the table `Collaborator` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Collaborator_postId_userId_key" ON "Collaborator"("postId", "userId");
