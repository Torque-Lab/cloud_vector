import {infraCreation,createCustomInfra,getProject} from "../../controller/infra/infra.controller";
import { Router } from "express";
import { authenticate } from "../../middlware/auth.middlware";
const router=Router();

router.post("/infra",infraCreation);
router.post("/custom",createCustomInfra);
router.get("/projects",authenticate,getProject);
export default router;
