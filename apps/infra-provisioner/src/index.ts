import express from "express";
import postgresRouter from "../routes/provisioner/provisioner.route";
import { consumeInfraConfigFromQueueToCreate } from "@cloud/backend-common";
import { PostgresProvisioner } from "../controllers/provisioner/postgres.controller";


consumeInfraConfigFromQueueToCreate("posgres-create-queue",PostgresProvisioner);
