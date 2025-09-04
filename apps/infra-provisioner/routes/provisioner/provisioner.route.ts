import { Router } from "express";
import { argocdWebhook, provisioner } from "../../controllers/provisioner/provisioner.controller";

const router = Router();

router.post("/provisioner", provisioner);
router.post("/argocd-webhook", argocdWebhook);

export default router;