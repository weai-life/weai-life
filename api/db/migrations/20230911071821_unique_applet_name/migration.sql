/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Applet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Applet_name_key" ON "Applet"("name");
