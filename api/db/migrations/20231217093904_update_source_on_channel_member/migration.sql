/*
  Warnings:

  - The `source` column on the `ChannelMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MemberSource" AS ENUM ('INVITED', 'APPLIED', 'PULLED', 'GROUP_MEMBER');

-- AlterTable
ALTER TABLE "ChannelMember" DROP COLUMN "source",
ADD COLUMN     "source" "MemberSource" NOT NULL DEFAULT 'INVITED';
