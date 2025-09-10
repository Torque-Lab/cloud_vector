-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'DEVELOPER');

-- CreateEnum
CREATE TYPE "public"."Tier_Subscription" AS ENUM ('FREE', 'BASE', 'PRO');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('INACTIVE', 'ACTIVE', 'INCOMPLETE', 'INCOMPLETE_EXPIRED', 'TRIALING', 'PAST_DUE', 'CANCELED', 'UNPAID');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('REQUIRES_PAYMENT_METHOD', 'REQUIRES_CONFIRMATION', 'REQUIRES_ACTION', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "public"."PaymentType" AS ENUM ('CURRENT', 'HISTORY');

-- CreateEnum
CREATE TYPE "public"."InvoiceStatus" AS ENUM ('DRAFT', 'OPEN', 'PAID', 'UNCOLLECTIBLE', 'VOID');

-- CreateTable
CREATE TABLE "public"."UserBaseAdmin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'ADMIN',
    "last_login" TIMESTAMP(3),
    "last_logout" TIMESTAMP(3),
    "last_active" TIMESTAMP(3),
    "login_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserBaseAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(3),
    "last_logout" TIMESTAMP(3),
    "last_active" TIMESTAMP(3),
    "login_count" INTEGER NOT NULL DEFAULT 0,
    "role" "public"."Role" NOT NULL DEFAULT 'DEVELOPER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Permission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "postgresDBId" TEXT NOT NULL,
    "rabbitmqId" TEXT NOT NULL,
    "redisId" TEXT NOT NULL,
    "vectorDBId" TEXT NOT NULL,
    "userBaseAdminId" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'DEVELOPER',
    "permission_given_by" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PermissionItem" (
    "id" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "PermissionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userBaseAdminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VectorDB" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_provisioned" BOOLEAN NOT NULL DEFAULT false,
    "api_key" TEXT NOT NULL DEFAULT '',
    "vectordb_url" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VectorDB_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PostgresDB" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_provisioned" BOOLEAN NOT NULL DEFAULT false,
    "api_key" TEXT NOT NULL DEFAULT '',
    "postgres_url" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostgresDB_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RabbitMQ" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_provisioned" BOOLEAN NOT NULL DEFAULT false,
    "api_key" TEXT NOT NULL DEFAULT '',
    "rabbitmq_url" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RabbitMQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Redis" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_provisioned" BOOLEAN NOT NULL DEFAULT false,
    "api_key" TEXT NOT NULL DEFAULT '',
    "redis_url" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Redis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TierRule" (
    "id" TEXT NOT NULL,
    "tier" "public"."Tier_Subscription" NOT NULL,
    "Max_Projects" INTEGER NOT NULL,
    "Max_Databases" INTEGER NOT NULL,

    CONSTRAINT "TierRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" TEXT NOT NULL,
    "userBaseAdminId" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "stripeProductId" TEXT,
    "status" "public"."SubscriptionStatus" NOT NULL DEFAULT 'INACTIVE',
    "currentPeriodStart" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "canceledAt" TIMESTAMP(3),
    "tier" "public"."Tier_Subscription" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Resource_Usage" (
    "id" TEXT NOT NULL,
    "userBaseAdminId" TEXT NOT NULL,
    "read_QPM" INTEGER NOT NULL DEFAULT 0,
    "write_QPM" INTEGER NOT NULL DEFAULT 0,
    "bandwidth" INTEGER NOT NULL DEFAULT 0,
    "storage" INTEGER NOT NULL DEFAULT 0,
    "index_rebuilds" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resource_Usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "userBaseAdminId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "stripeInvoiceId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL,
    "paymentMethod" TEXT,
    "receiptUrl" TEXT,
    "type" "public"."PaymentType" NOT NULL DEFAULT 'CURRENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Invoice" (
    "id" TEXT NOT NULL,
    "stripeInvoiceId" TEXT NOT NULL,
    "userBaseAdminId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "public"."InvoiceStatus" NOT NULL,
    "hostedInvoiceUrl" TEXT,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBaseAdmin_email_key" ON "public"."UserBaseAdmin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VectorDB_api_key_key" ON "public"."VectorDB"("api_key");

-- CreateIndex
CREATE UNIQUE INDEX "PostgresDB_api_key_key" ON "public"."PostgresDB"("api_key");

-- CreateIndex
CREATE UNIQUE INDEX "RabbitMQ_api_key_key" ON "public"."RabbitMQ"("api_key");

-- CreateIndex
CREATE UNIQUE INDEX "Redis_api_key_key" ON "public"."Redis"("api_key");

-- CreateIndex
CREATE UNIQUE INDEX "TierRule_tier_key" ON "public"."TierRule"("tier");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_Usage_userBaseAdminId_key" ON "public"."Resource_Usage"("userBaseAdminId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_userBaseAdminId_key" ON "public"."Payment"("userBaseAdminId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_stripeInvoiceId_key" ON "public"."Invoice"("stripeInvoiceId");

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_postgresDBId_fkey" FOREIGN KEY ("postgresDBId") REFERENCES "public"."PostgresDB"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_rabbitmqId_fkey" FOREIGN KEY ("rabbitmqId") REFERENCES "public"."RabbitMQ"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_redisId_fkey" FOREIGN KEY ("redisId") REFERENCES "public"."Redis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_vectorDBId_fkey" FOREIGN KEY ("vectorDBId") REFERENCES "public"."VectorDB"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_userBaseAdminId_fkey" FOREIGN KEY ("userBaseAdminId") REFERENCES "public"."UserBaseAdmin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PermissionItem" ADD CONSTRAINT "PermissionItem_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_userBaseAdminId_fkey" FOREIGN KEY ("userBaseAdminId") REFERENCES "public"."UserBaseAdmin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VectorDB" ADD CONSTRAINT "VectorDB_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PostgresDB" ADD CONSTRAINT "PostgresDB_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RabbitMQ" ADD CONSTRAINT "RabbitMQ_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Redis" ADD CONSTRAINT "Redis_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_userBaseAdminId_fkey" FOREIGN KEY ("userBaseAdminId") REFERENCES "public"."UserBaseAdmin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Resource_Usage" ADD CONSTRAINT "Resource_Usage_userBaseAdminId_fkey" FOREIGN KEY ("userBaseAdminId") REFERENCES "public"."UserBaseAdmin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_userBaseAdminId_fkey" FOREIGN KEY ("userBaseAdminId") REFERENCES "public"."UserBaseAdmin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_userBaseAdminId_fkey" FOREIGN KEY ("userBaseAdminId") REFERENCES "public"."UserBaseAdmin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
