/*
  Warnings:

  - Made the column `appletId` on table `AppletUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `AppletUser` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AppletUser" DROP CONSTRAINT "AppletUser_appletId_fkey";

-- DropForeignKey
ALTER TABLE "AppletUser" DROP CONSTRAINT "AppletUser_userId_fkey";

-- AlterTable
ALTER TABLE "AppletUser" ALTER COLUMN "appletId" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "AppletUser" ADD CONSTRAINT "AppletUser_appletId_fkey" FOREIGN KEY ("appletId") REFERENCES "Applet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppletUser" ADD CONSTRAINT "AppletUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
