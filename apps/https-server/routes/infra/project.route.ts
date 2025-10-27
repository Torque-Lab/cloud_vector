
import { Router } from "express";
import { authenticate } from "../../middlware/auth.middlware";
import { createProject, getProjectDetails, getProjects } from "../../controller/infra/project.controller";
import { genricRateLimiter } from "../../middlware/ratelimit.middlware";
const router=Router();

router.get("/projects",genricRateLimiter(15, 300),authenticate,getProjects);
router.get("/project-details",genricRateLimiter(15, 300),authenticate,getProjectDetails);
router.post("/project/create",genricRateLimiter(15, 300),authenticate,createProject);
export default router;