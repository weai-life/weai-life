/*
  Warnings:

  - You are about to drop the column `contentType` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "contentType",
ADD COLUMN     "schema" TEXT;

-- CreateTable
CREATE TABLE "AppletUser" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "store" JSONB NOT NULL DEFAULT '{}',
    "appletId" INTEGER,
    "userId" INTEGER,

    CONSTRAINT "AppletUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppletUser_appletId_userId_key" ON "AppletUser"("appletId", "userId");

-- AddForeignKey
ALTER TABLE "AppletUser" ADD CONSTRAINT "AppletUser_appletId_fkey" FOREIGN KEY ("appletId") REFERENCES "Applet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppletUser" ADD CONSTRAINT "AppletUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
