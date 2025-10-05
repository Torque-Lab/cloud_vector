import { prismaClient } from "@cloud/db";

async function main() {
  console.log(" Deleting ALL data from database...");
  await prismaClient.permissionItem.deleteMany();
  await prismaClient.permission.deleteMany();

  await prismaClient.backupHistory.deleteMany();

  await prismaClient.virtualMachine.deleteMany();
  await prismaClient.vectorDB.deleteMany();
  await prismaClient.postgresDB.deleteMany();
  await prismaClient.rabbitMQ.deleteMany();
  await prismaClient.redis.deleteMany();

  await prismaClient.project.deleteMany();

  await prismaClient.invoice.deleteMany();
  await prismaClient.payment.deleteMany();
  await prismaClient.resource_Usage.deleteMany();
  await prismaClient.subscription.deleteMany();

  await prismaClient.user.deleteMany();
  await prismaClient.userBaseAdmin.deleteMany();

  await prismaClient.tierRule.deleteMany();

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
