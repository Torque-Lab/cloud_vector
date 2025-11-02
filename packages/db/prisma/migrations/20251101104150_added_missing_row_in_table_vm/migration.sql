/*
  Warnings:

  - Added the required column `cpu` to the `VirtualMachine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memory` to the `VirtualMachine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storage` to the `VirtualMachine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VirtualMachine" ADD COLUMN     "cpu" TEXT NOT NULL,
ADD COLUMN     "memory" TEXT NOT NULL,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "storage" TEXT NOT NULL;
