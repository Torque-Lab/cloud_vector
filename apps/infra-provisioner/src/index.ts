import express from "express";
import { consumeInfraConfigFromQueueToCreate } from "@cloud/backend-common";
import { PostgresProvisioner } from "../controllers/postgres/postgres.controller";


consumeInfraConfigFromQueueToCreate("postgres_create_queue",PostgresProvisioner);
