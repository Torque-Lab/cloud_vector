/*
  Warnings:

  - Added the required column `autoScale` to the `PostgresDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialMemory` to the `PostgresDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialStorage` to the `PostgresDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialVCpu` to the `PostgresDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxMemory` to the `PostgresDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxStorage` to the `PostgresDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxVCpu` to the `PostgresDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `autoScale` to the `RabbitMQ` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialMemory` to the `RabbitMQ` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialStorage` to the `RabbitMQ` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialVCpu` to the `RabbitMQ` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxMemory` to the `RabbitMQ` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxStorage` to the `RabbitMQ` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxVCpu` to the `RabbitMQ` table without a default value. This is not possible if the table is not empty.
  - Added the required column `autoScale` to the `Redis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialMemory` to the `Redis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialStorage` to the `Redis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialVCpu` to the `Redis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxMemory` to the `Redis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxStorage` to the `Redis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxVCpu` to the `Redis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `autoScale` to the `VectorDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialMemory` to the `VectorDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialStorage` to the `VectorDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialVCpu` to the `VectorDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxMemory` to the `VectorDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxStorage` to the `VectorDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxVCpu` to the `VectorDB` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PostgresDB" ADD COLUMN     "autoScale" BOOLEAN NOT NULL,
ADD COLUMN     "backUpFrequency" TEXT,
ADD COLUMN     "initialMemory" TEXT NOT NULL,
ADD COLUMN     "initialStorage" TEXT NOT NULL,
ADD COLUMN     "initialVCpu" TEXT NOT NULL,
ADD COLUMN     "maxMemory" TEXT NOT NULL,
ADD COLUMN     "maxStorage" TEXT NOT NULL,
ADD COLUMN     "maxVCpu" TEXT NOT NULL,
ADD COLUMN     "region" TEXT;

-- AlterTable
ALTER TABLE "RabbitMQ" ADD COLUMN     "autoScale" BOOLEAN NOT NULL,
ADD COLUMN     "backUpFrequency" TEXT,
ADD COLUMN     "initialMemory" TEXT NOT NULL,
ADD COLUMN     "initialStorage" TEXT NOT NULL,
ADD COLUMN     "initialVCpu" TEXT NOT NULL,
ADD COLUMN     "maxMemory" TEXT NOT NULL,
ADD COLUMN     "maxStorage" TEXT NOT NULL,
ADD COLUMN     "maxVCpu" TEXT NOT NULL,
ADD COLUMN     "region" TEXT;

-- AlterTable
ALTER TABLE "Redis" ADD COLUMN     "autoScale" BOOLEAN NOT NULL,
ADD COLUMN     "backUpFrequency" TEXT,
ADD COLUMN     "initialMemory" TEXT NOT NULL,
ADD COLUMN     "initialStorage" TEXT NOT NULL,
ADD COLUMN     "initialVCpu" TEXT NOT NULL,
ADD COLUMN     "maxMemory" TEXT NOT NULL,
ADD COLUMN     "maxStorage" TEXT NOT NULL,
ADD COLUMN     "maxVCpu" TEXT NOT NULL,
ADD COLUMN     "region" TEXT;

-- AlterTable
ALTER TABLE "VectorDB" ADD COLUMN     "autoScale" BOOLEAN NOT NULL,
ADD COLUMN     "backUpFrequency" TEXT,
ADD COLUMN     "initialMemory" TEXT NOT NULL,
ADD COLUMN     "initialStorage" TEXT NOT NULL,
ADD COLUMN     "initialVCpu" TEXT NOT NULL,
ADD COLUMN     "maxMemory" TEXT NOT NULL,
ADD COLUMN     "maxStorage" TEXT NOT NULL,
ADD COLUMN     "maxVCpu" TEXT NOT NULL,
ADD COLUMN     "region" TEXT;
