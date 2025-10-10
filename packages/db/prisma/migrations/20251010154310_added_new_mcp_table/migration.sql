-- AlterTable
ALTER TABLE "PermissionItem" ADD COLUMN     "permissionMCPId" TEXT,
ALTER COLUMN "permissionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "cost" TEXT NOT NULL DEFAULT '0',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "company" TEXT,
ADD COLUMN     "job_title" TEXT,
ADD COLUMN     "mfa" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserBaseAdmin" ADD COLUMN     "company" TEXT,
ADD COLUMN     "job_title" TEXT,
ADD COLUMN     "mfa" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "PhoneNumber" (
    "id" TEXT NOT NULL,
    "userBaseAdminId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,

    CONSTRAINT "PhoneNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionMCP" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "userBaseAdminId" TEXT,
    "projectId" TEXT NOT NULL,
    "virtualMachineId" TEXT,
    "postgresDBId" TEXT,
    "rabbitmqId" TEXT,
    "redisId" TEXT,
    "vectorDBId" TEXT,
    "permission_given_by_base_admin_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermissionMCP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPApiKeys" (
    "id" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userBaseAdminId" TEXT,
    "userId" TEXT,
    "permissionMCPId" TEXT NOT NULL,

    CONSTRAINT "MCPApiKeys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PermissionMCP_userId_idx" ON "PermissionMCP"("userId");

-- CreateIndex
CREATE INDEX "PermissionMCP_projectId_idx" ON "PermissionMCP"("projectId");

-- AddForeignKey
ALTER TABLE "PhoneNumber" ADD CONSTRAINT "PhoneNumber_userBaseAdminId_fkey" FOREIGN KEY ("userBaseAdminId") REFERENCES "UserBaseAdmin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhoneNumber" ADD CONSTRAINT "PhoneNumber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionItem" ADD CONSTRAINT "PermissionItem_permissionMCPId_fkey" FOREIGN KEY ("permissionMCPId") REFERENCES "PermissionMCP"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionMCP" ADD CONSTRAINT "PermissionMCP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionMCP" ADD CONSTRAINT "PermissionMCP_userBaseAdminId_fkey" FOREIGN KEY ("userBaseAdminId") REFERENCES "UserBaseAdmin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionMCP" ADD CONSTRAINT "PermissionMCP_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionMCP" ADD CONSTRAINT "PermissionMCP_virtualMachineId_fkey" FOREIGN KEY ("virtualMachineId") REFERENCES "VirtualMachine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionMCP" ADD CONSTRAINT "PermissionMCP_postgresDBId_fkey" FOREIGN KEY ("postgresDBId") REFERENCES "PostgresDB"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionMCP" ADD CONSTRAINT "PermissionMCP_rabbitmqId_fkey" FOREIGN KEY ("rabbitmqId") REFERENCES "RabbitMQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionMCP" ADD CONSTRAINT "PermissionMCP_redisId_fkey" FOREIGN KEY ("redisId") REFERENCES "Redis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionMCP" ADD CONSTRAINT "PermissionMCP_vectorDBId_fkey" FOREIGN KEY ("vectorDBId") REFERENCES "VectorDB"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPApiKeys" ADD CONSTRAINT "MCPApiKeys_userBaseAdminId_fkey" FOREIGN KEY ("userBaseAdminId") REFERENCES "UserBaseAdmin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPApiKeys" ADD CONSTRAINT "MCPApiKeys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPApiKeys" ADD CONSTRAINT "MCPApiKeys_permissionMCPId_fkey" FOREIGN KEY ("permissionMCPId") REFERENCES "PermissionMCP"("id") ON DELETE CASCADE ON UPDATE CASCADE;
