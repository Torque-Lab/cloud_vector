import express from "express";
import { consumeInfraConfigFromQueueToCreate } from "@cloud/backend-common";
import { PostgresProvisioner } from "../controllers/postgres/postgres.controller";
import { rabbitMQProvisioner } from "../controllers/rabbitmq/rabbitmq.controller";
import { redisProvisioner } from "../controllers/redis/redis.controller";
import { postgresQueue, rabbitmqQueue, redisQueue } from "@cloud/backend-common";

async function startAllConsumers(){
consumeInfraConfigFromQueueToCreate(postgresQueue.CREATE,PostgresProvisioner);
consumeInfraConfigFromQueueToCreate(rabbitmqQueue.CREATE,rabbitMQProvisioner);
consumeInfraConfigFromQueueToCreate(redisQueue.CREATE,redisProvisioner);
}

startAllConsumers();