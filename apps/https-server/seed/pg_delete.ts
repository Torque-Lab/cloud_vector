import { prismaClient } from "@cloud/db";

async function main() {
  console.log(" Deleting ALL data from database...");
await Promise.all([
    prismaClient.permissionItem.deleteMany(),
    prismaClient.permission.deleteMany(),
    prismaClient.backupHistory.deleteMany(),
    prismaClient.virtualMachine.deleteMany(),
    prismaClient.vectorDB.deleteMany(),
    prismaClient.postgresDB.deleteMany(),
    prismaClient.rabbitMQ.deleteMany(),
    prismaClient.redis.deleteMany(),
    prismaClient.project.deleteMany(),
    prismaClient.invoice.deleteMany(),
    prismaClient.payment.deleteMany(),
    prismaClient.resource_Usage.deleteMany(),
    prismaClient.subscription.deleteMany(),
    prismaClient.user.deleteMany(),
    prismaClient.userBaseAdmin.deleteMany(),
    prismaClient.tierRule.deleteMany(),
])

  console.log(" All data deleted successfully!");
}

main()
  .catch((e) => {
    console.error(" Error clearing database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
