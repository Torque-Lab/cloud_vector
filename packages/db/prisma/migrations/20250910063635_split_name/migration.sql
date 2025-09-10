/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `UserBaseAdmin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "name",
ADD COLUMN     "frist_name" TEXT,
ADD COLUMN     "last_name" TEXT;

-- AlterTable
ALTER TABLE "public"."UserBaseAdmin" DROP COLUMN "name",
ADD COLUMN     "frist_name" TEXT,
ADD COLUMN     "last_name" TEXT;
