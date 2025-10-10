
import { Router } from "express";
import { authenticate } from "../../middlware/auth.middlware";
import { getProjectDetails, getProjects } from "../../controller/infra/project.controller";
const router=Router();

router.get("/projects",authenticate,getProjects);
router.get("/project-details",authenticate,getProjectDetails);
export default router;