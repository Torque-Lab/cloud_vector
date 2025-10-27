/*
  Warnings:

  - You are about to drop the column `tier` on the `Subscription` table. All the data in the column will be lost.
  - Made the column `stripeCustomerId` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "tier",
ALTER COLUMN "stripeCustomerId" SET NOT NULL,
ALTER COLUMN "tierId" DROP NOT NULL;
