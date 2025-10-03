/*
  Warnings:

  - You are about to drop the column `permission_given_by` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `userBaseAdminId` on the `Permission` table. All the data in the column will be lost.
  - The `permission` column on the `PermissionItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `name` on the `PostgresDB` table. All the data in the column will be lost.
  - You are about to drop the column `postgres_url` on the `PostgresDB` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `RabbitMQ` table. All the data in the column will be lost.
  - You are about to drop the column `rabbitmq_url` on the `RabbitMQ` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Redis` table. All the data in the column will be lost.
  - You are about to drop the column `redis_url` on the `Redis` table. All the data in the column will be lost.
  - You are about to drop the column `Max_Databases` on the `TierRule` table. All the data in the column will be lost.
  - You are about to drop the column `frist_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `frist_name` on the `UserBaseAdmin` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `VectorDB` table. All the data in the column will be lost.
  - You are about to drop the column `vectordb_url` on the `VectorDB` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId]` on the table `PostgresDB` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userBaseAdminId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tierId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `namespace` to the `PostgresDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namespace` to the `RabbitMQ` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namespace` to the `Redis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tierId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TierRule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userBaseAdminId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `database_name` to the `VectorDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `host` to the `VectorDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namespace` to the `VectorDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `VectorDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `port` to the `VectorDB` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `VectorDB` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PermissionList" AS ENUM ('NONE', 'CREATE_USER', 'READ_USER', 'UPDATE_USER', 'DELETE_USER', 'CREATE_PROJECT', 'READ_PROJECT', 'UPDATE_PROJECT', 'DELETE_PROJECT', 'CREATE_POSTGRES', 'READ_POSTGRES', 'UPDATE_POSTGRES', 'DELETE_POSTGRES', 'DOWNLOAD_BACKUP', 'CREATE_RABBITMQ', 'READ_RABBITMQ', 'UPDATE_RABBITMQ', 'DELETE_RABBITMQ', 'CREATE_REDIS', 'READ_REDIS', 'UPDATE_REDIS', 'DELETE_REDIS', 'CREATE_VECTORDB', 'READ_VECTORDB', 'UPDATE_VECTORDB', 'DELETE_VECTORDB');

-- CreateEnum
CREATE TYPE "public"."ProvisioningFlowStatus" AS ENUM ('ADDED_TO_QUEUE', 'PUSHED_TO_ARGOCD', 'SYNCED_TO_ARGOCD', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."BackupStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- AlterEnum
ALTER TYPE "public"."Tier_Subscription" ADD VALUE 'ENTERPRISE';

-- DropForeignKey
ALTER TABLE "public"."Invoice" DROP CONSTRAINT "Invoice_userBaseAdminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_userBaseAdminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Permission" DROP CONSTRAINT "Permission_postgresDBId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Permission" DROP CONSTRAINT "Permission_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Permission" DROP CONSTRAINT "Permission_rabbitmqId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Permission" DROP CONSTRAINT "Permission_redisId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Permission" DROP CONSTRAINT "Permission_userBaseAdminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Permission" DROP CONSTRAINT "Permission_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Permission" DROP CONSTRAINT "Permission_vectorDBId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PermissionItem" DROP CONSTRAINT "PermissionItem_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PostgresDB" DROP CONSTRAINT "PostgresDB_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_userBaseAdminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RabbitMQ" DROP CONSTRAINT "RabbitMQ_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Redis" DROP CONSTRAINT "Redis_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Resource_Usage" DROP CONSTRAINT "Resource_Usage_userBaseAdminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_userBaseAdminId_fkey";

-- DropForeignKey
ALTER TABLE "public"."VectorDB" DROP CONSTRAINT "VectorDB_projectId_fkey";

-- AlterTable
ALTER TABLE "public"."Permission" DROP COLUMN "permission_given_by",
DROP COLUMN "role",
DROP COLUMN "userBaseAdminId",
ADD COLUMN     "permission_given_by_base_admin_id" TEXT,
ADD COLUMN     "virtualMachineId" TEXT,
ALTER COLUMN "postgresDBId" DROP NOT NULL,
ALTER COLUMN "rabbitmqId" DROP NOT NULL,
ALTER COLUMN "redisId" DROP NOT NULL,
ALTER COLUMN "vectorDBId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."PermissionItem" DROP COLUMN "permission",
ADD COLUMN     "permission" "public"."PermissionList" NOT NULL DEFAULT 'NONE';

-- AlterTable
ALTER TABLE "public"."PostgresDB" DROP COLUMN "name",
DROP COLUMN "postgres_url",
ADD COLUMN     "database_name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "host" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "namespace" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "port" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "provisioning_flow_status" "public"."ProvisioningFlowStatus" NOT NULL DEFAULT 'ADDED_TO_QUEUE',
ADD COLUMN     "username" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "api_key" DROP NOT NULL,
ALTER COLUMN "api_key" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Project" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."RabbitMQ" DROP COLUMN "name",
DROP COLUMN "rabbitmq_url",
ADD COLUMN     "host" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "namespace" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "port" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "provisioning_flow_status" "public"."ProvisioningFlowStatus" NOT NULL DEFAULT 'PUSHED_TO_ARGOCD',
ADD COLUMN     "queue_name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "username" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "api_key" DROP NOT NULL,
ALTER COLUMN "api_key" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Redis" DROP COLUMN "name",
DROP COLUMN "redis_url",
ADD COLUMN     "host" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "namespace" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "port" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "provisioning_flow_status" "public"."ProvisioningFlowStatus" NOT NULL DEFAULT 'PUSHED_TO_ARGOCD',
ADD COLUMN     "redis_name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "username" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "api_key" DROP NOT NULL,
ALTER COLUMN "api_key" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Resource_Usage" ADD COLUMN     "cpu" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "memory" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "index_rebuilds" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Subscription" ADD COLUMN     "tierId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE',
ALTER COLUMN "tier" SET DEFAULT 'FREE';

-- AlterTable
ALTER TABLE "public"."TierRule" DROP COLUMN "Max_Databases",
ADD COLUMN     "Max_Resources" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "initialMemory" TEXT NOT NULL DEFAULT '200Mi',
ADD COLUMN     "initialStorage" TEXT NOT NULL DEFAULT '1Gi',
ADD COLUMN     "initialVCpu" TEXT NOT NULL DEFAULT '1',
ADD COLUMN     "maxMemory" TEXT NOT NULL DEFAULT '500Mi',
ADD COLUMN     "maxStorage" TEXT NOT NULL DEFAULT '5Gi',
ADD COLUMN     "maxVCpu" TEXT NOT NULL DEFAULT '2',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "Max_Projects" SET DEFAULT 5;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "frist_name",
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "userBaseAdminId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserBaseAdmin" DROP COLUMN "frist_name",
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."VectorDB" DROP COLUMN "name",
DROP COLUMN "vectordb_url",
ADD COLUMN     "database_name" TEXT NOT NULL,
ADD COLUMN     "host" TEXT NOT NULL,
ADD COLUMN     "namespace" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "port" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "api_key" DROP NOT NULL,
ALTER COLUMN "api_key" DROP DEFAULT;

-- CreateTable
CREATE TABLE "public"."VirtualMachine" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_provisioned" BOOLEAN NOT NULL DEFAULT false,
    "api_key" TEXT,
    "vm_name" TEXT NOT NULL,
    "public_key" TEXT,
    "host" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VirtualMachine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BackupHistory" (
    "id" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "backup_time_taken" TEXT,
    "status" "public"."BackupStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BackupHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VirtualMachine_api_key_key" ON "public"."VirtualMachine"("api_key");

-- CreateIndex
CREATE INDEX "VirtualMachine_projectId_idx" ON "public"."VirtualMachine"("projectId");

-- CreateIndex
CREATE INDEX "Invoice_userBaseAdminId_idx" ON "public"."Invoice"("userBaseAdminId");

-- CreateIndex
CREATE INDEX "Permission_userId_idx" ON "public"."Permission"("userId");

-- CreateIndex
CREATE INDEX "Permission_projectId_idx" ON "public"."Permission"("projectId");

-- CreateIndex
CREATE INDEX "PermissionItem_permissionId_idx" ON "public"."PermissionItem"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "PostgresDB_projectId_key" ON "public"."PostgresDB"("projectId");

-- CreateIndex
CREATE INDEX "PostgresDB_projectId_idx" ON "public"."PostgresDB"("projectId");

-- CreateIndex
CREATE INDEX "Project_userBaseAdminId_idx" ON "public"."Project"("userBaseAdminId");

-- CreateIndex
CREATE INDEX "RabbitMQ_projectId_idx" ON "public"."RabbitMQ"("projectId");

-- CreateIndex
CREATE INDEX "Redis_projectId_idx" ON "public"."Redis"("projectId");

-- CreateIndex
CREATE INDEX "Resource_Usage_userBaseAdminId_idx" ON "public"."Resource_Usage"("userBaseAdminId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userBaseAdminId_key" ON "public"."Subscription"("userBaseAdminId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_tierId_key" ON "public"."Subscription"("tierId");

-- CreateIndex
CREATE INDEX "Subscription_userBaseAdminId_idx" ON "public"."Subscription"("userBaseAdminId");

-- CreateIndex
CREATE INDEX "VectorDB_projectId_idx" ON "public"."VectorDB"("projectId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_userBaseAdminId_fkey" FOREIGN KEY ("userBaseAdminId") REFERENCES "public"."UserBaseAdmin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_virtualMachineId_fkey" FOREIGN KEY ("virtualMachineId") REFERENCES "public"."VirtualMachine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_postgresDBId_fkey" FOREIGN KEY ("postgresDBId") REFERENCES "public"."PostgresDB"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_rabbitmqId_fkey" FOREIGN KEY ("rabbitmqId") REFERENCES "public"."RabbitMQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_redisId_fkey" FOREIGN KEY ("redisId") REFERENCES "public"."Redis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_vectorDBId_fkey" FOREIGN KEY ("vectorDBId") REFERENCES "public"."VectorDB"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PermissionItem" ADD CONSTRAINT "PermissionItem_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_userBaseAdminId_fkey" FOREIGN KEY ("userBaseAdminId") REFERENCES "public"."UserBaseAdmin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VirtualMachine" ADD CONSTRAINT "VirtualMachine_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VectorDB" ADD CONSTRAINT "VectorDB_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PostgresDB" ADD CONSTRAINT "PostgresDB_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BackupHistory" ADD CONSTRAINT "BackupHistory_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."PostgresDB"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RabbitMQ" ADD CONSTRAINT "RabbitMQ_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Redis" ADD CONSTRAINT "Redis_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "public"."TierRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_userBaseAdminId_fkey" FOREIGN KEY ("userBaseAdminId") REFERENCES "public"."UserBaseAdmin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Resource_Usage" ADD CONSTRAINT "Resource_Usage_userBaseAdminId_fkey" FOREIGN KEY ("userBaseAdminId") REFERENCES "public"."UserBaseAdmin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_userBaseAdminId_fkey" FOREIGN KEY ("userBaseAdminId") REFERENCES "public"."UserBaseAdmin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_userBaseAdminId_fkey" FOREIGN KEY ("userBaseAdminId") REFERENCES "public"."UserBaseAdmin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
