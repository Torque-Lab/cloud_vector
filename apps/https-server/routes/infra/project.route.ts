
import { Router } from "express";
import { authenticate } from "../../middlware/auth.middlware";
import { createProject, getProjectDetails, getProjects } from "../../controller/infra/project.controller";
const router=Router();

router.get("/projects",authenticate,getProjects);
router.get("/project-details",authenticate,getProjectDetails);
router.post("/project/create",authenticate,createProject);
export default router;