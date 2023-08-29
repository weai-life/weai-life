-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "appletId" INTEGER;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "appletId" INTEGER;

-- CreateTable
CREATE TABLE "Applet" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Applet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_appletId_fkey" FOREIGN KEY ("appletId") REFERENCES "Applet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_appletId_fkey" FOREIGN KEY ("appletId") REFERENCES "Applet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
