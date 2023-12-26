/*
  Warnings:

  - A unique constraint covering the columns `[appletUserId,tagId]` on the table `AppletUserTag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AppletUserTag_appletUserId_tagId_key" ON "AppletUserTag"("appletUserId", "tagId");
