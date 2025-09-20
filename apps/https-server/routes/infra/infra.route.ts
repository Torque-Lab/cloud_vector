
import { Router } from "express";
import { authenticate } from "../../middlware/auth.middlware";
import { getProject } from "../../controller/infra/postgres.controller";
const router=Router();


router.get("/projects",authenticate,getProject);
export default router;
