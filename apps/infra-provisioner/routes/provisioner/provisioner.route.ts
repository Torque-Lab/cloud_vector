import { Router } from "express";
import { argocdWebhook, PostgresProvisioner } from "../../controllers/provisioner/postgres.controller";

const router = Router();

router.post("/postgres-create", PostgresProvisioner);
router.post("/argocd-webhook", argocdWebhook);

export default router;