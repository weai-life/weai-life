-- CreateEnum
CREATE TYPE "PostAccessType" AS ENUM ('PRIVATE', 'PUBLIC', 'PAID');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "accessType" "PostAccessType" NOT NULL DEFAULT 'PRIVATE';
