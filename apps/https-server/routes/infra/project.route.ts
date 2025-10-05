
import { Router } from "express";
import { authenticate } from "../../middlware/auth.middlware";
import { getProjects } from "../../controller/infra/project.controller";
const router=Router();

router.get("/projects",authenticate,getProjects);
export default router;