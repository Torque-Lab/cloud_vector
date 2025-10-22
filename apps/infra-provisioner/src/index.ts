
import { consumeInfraConfigFromQueueToCreate,consumeVmFromQueueToCreate } from "@cloud/backend-common";
import {consumeInfraConfigFromQueueToDelete,consumeVmFromQueueToDelete} from "@cloud/backend-common";
import { PostgresProvisioner, PostgresDestroyer } from "../controllers/postgres/postgres.controller";
import { rabbitMQProvisioner, rabbitMQDestroyer } from "../controllers/rabbitmq/rabbitmq.controller";
import { redisProvisioner, redisDestroyer } from "../controllers/redis/redis.controller";
import { vmDestroyer, vmProvisioner } from "../controllers/virtual_machine/vm-controller";
import { postgresQueue, rabbitmqQueue, redisQueue,vmQueue } from "@cloud/backend-common";

async function startAllConsumers(){
consumeInfraConfigFromQueueToCreate(postgresQueue.CREATE,PostgresProvisioner);
consumeInfraConfigFromQueueToCreate(rabbitmqQueue.CREATE,rabbitMQProvisioner);
consumeInfraConfigFromQueueToCreate(redisQueue.CREATE,redisProvisioner);
consumeVmFromQueueToCreate(vmQueue.CREATE,vmProvisioner);
}


async function startAllConsumersDelete(){
consumeInfraConfigFromQueueToDelete(postgresQueue.DELETE,PostgresDestroyer);
consumeInfraConfigFromQueueToDelete(rabbitmqQueue.DELETE,rabbitMQDestroyer);
consumeInfraConfigFromQueueToDelete(redisQueue.DELETE,redisDestroyer);
consumeVmFromQueueToDelete(vmQueue.DELETE,vmDestroyer);
}

startAllConsumers();
startAllConsumersDelete();