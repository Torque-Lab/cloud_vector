import {
  Role,
  Tier_Subscription,
  SubscriptionStatus,
  PaymentStatus,
  PaymentType,
  InvoiceStatus,
  ProvisioningFlowStatus,
  PermissionList,
  prismaClient,
} from "@cloud/db";
import { hashPassword } from "../controller/auth/auth.controller";
import { encrypt } from "@cloud/backend-common";


async function main() {
  const PG_ENCRYPT_SECRET = process.env.PG_ENCRYPT_SECRET!;
  console.log(" Seeding Pro user with all resources...");
  const proTierRule = await prismaClient.tierRule.upsert({
    where: { tier: Tier_Subscription.PRO },
    update: {},
    create: {
      tier: Tier_Subscription.PRO,
      Max_Projects: 20,
      Max_Resources: 1000,
      initialMemory: "500Mi",
      maxMemory: "2Gi",
      initialStorage: "5Gi",
      maxStorage: "50Gi",
      initialVCpu: "2",
      maxVCpu: "8",
    },
  });

  const admin = await prismaClient.userBaseAdmin.create({
    data: {
      email: "admin.pro@example.com",
      password: await hashPassword("hash1@M12##*123"),
      first_name: "Dev",
      last_name: "sudo",
      role: Role.ADMIN,
      is_active: true,
    },
  });

  await prismaClient.subscription.create({
    data: {
      userBaseAdminId: admin.id,
      tier: Tier_Subscription.PRO,
      tierId: proTierRule.id,
      status: SubscriptionStatus.ACTIVE,
    },
  });

  const devUser = await prismaClient.user.create({
    data: {
      email: "pro@example.com",
      password: await hashPassword("hash2@M12##*456"),
      first_name: "Mac",
      last_name: "jhon",
      userBaseAdminId: admin.id,
      role: Role.DEVELOPER,
      is_active: true,
    },
  });

  const project = await prismaClient.project.create({
    data: {
      name: "Mac Pro Project",
      description: "Full resource setup for Pro user",
      userBaseAdminId: admin.id,
      userId: devUser.id,
    },
  });

  const [postgres, redis, rabbitmq, vectordb, vm] = await Promise.all([
    prismaClient.postgresDB.create({
      data: {
        projectId: project.id,
        api_key: "pg_key_123",
        username: "pguser",
        password: await encrypt("pgpass",PG_ENCRYPT_SECRET),
        host: "pg.dev.local",
        port: "5432",
        database_name: "prodb",
        namespace: "pro-namespace",
        provisioning_flow_status: ProvisioningFlowStatus.COMPLETED,
      },
    }),
    prismaClient.redis.create({
      data: {
        projectId: project.id,
        api_key: "redis_key_123",
        username: "redisuser",
        password: "redispass",
        host: "redis.dev.local",
        port: "6379",
        redis_name: "pro-redis",
        namespace: "pro-namespace",
        is_provisioned: true,
      },
    }),
    prismaClient.rabbitMQ.create({
      data: {
        projectId: project.id,
        api_key: "rabbit_key_123",
        username: "rabbituser",
        password: "rabbitpass",
        host: "rabbit.dev.local",
        port: "5672",
        queue_name: "pro-queue",
        namespace: "pro-namespace",
        is_provisioned: true,
      },
    }),
    prismaClient.vectorDB.create({
      data: {
        projectId: project.id,
        api_key: "vector_key_123",
        username: "vectoruser",
        password: "vectorpass",
        host: "vector.dev.local",
        port: "6333",
        database_name: "provector",
        namespace: "pro-namespace",
        is_provisioned: true,
      },
    }),
    prismaClient.virtualMachine.create({
      data: {
        projectId: project.id,
        api_key: "vm_key_123",
        vm_name: "pro-vm",
        host: "vm.dev.local",
        public_key: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQD...",
        is_provisioned: true,
      },
    }),
  ]);

  const permission = await prismaClient.permission.create({
    data: {
      userId: devUser.id,
      projectId: project.id,
      virtualMachineId: vm.id,
      postgresDBId: postgres.id,
      redisId: redis.id,
      rabbitmqId: rabbitmq.id,
      vectorDBId: vectordb.id,
      permission_given_by_base_admin_id: admin.id,
      permissionItems: {
        create: Object.values(PermissionList)
          .filter((p) => p !== PermissionList.NONE)
          .map((perm) => ({ permission: perm })),
      },
    },
  });

  await prismaClient.resource_Usage.create({
    data: {
      userBaseAdminId: admin.id,
      memory: 8,
      cpu: 4,
      storage: 200,
      read_QPM: 20000,
      write_QPM: 10000,
      bandwidth: 100,
    },
  });

  await prismaClient.payment.create({
    data: {
      userBaseAdminId: admin.id,
      amount: 2999,
      currency: "usd",
      status: PaymentStatus.SUCCEEDED,
      paymentMethod: "card",
      type: PaymentType.CURRENT,
    },
  });

  await prismaClient.invoice.create({
    data: {
      stripeInvoiceId: "inv_dev_pro_full_001",
      userBaseAdminId: admin.id,
      amount: 2999,
      currency: "usd",
      status: InvoiceStatus.PAID,
    },
  });

  console.log(" Pro user with all resources and permissions seeded!");
}

await main()
  .catch((e) => {
    console.error("Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
