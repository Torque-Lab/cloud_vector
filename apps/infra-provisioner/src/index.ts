import express from "express";
import postgresRouter from "../routes/provisioner/provisioner.route";
import { consumeInfraConfigFromQueueToCreate } from "@cloud/backend-common";
import { PostgresProvisioner, scheduleGitPush } from "../controllers/provisioner/postgres.controller";
import { repoUrlWithPAT, branch } from "../config/config";


consumeInfraConfigFromQueueToCreate("posgres-create-queue",PostgresProvisioner);
scheduleGitPush(repoUrlWithPAT,branch)