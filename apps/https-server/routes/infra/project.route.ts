
import { Router } from "express";
import { authenticate } from "../../middlware/auth.middlware";
import { createProject, getProjectDetails, getProjects } from "../../controller/infra/project.controller";
import { genricRateLimiter } from "../../middlware/ratelimit.middlware";
import { deleteProject, getProjectDetailsDepth, pauseProject } from "../../controller/infra/project.controller";
const router=Router();
router.get("/projects",genricRateLimiter(15, 300),authenticate,getProjects);
router.get("/project-details",genricRateLimiter(15, 300),authenticate,getProjectDetails);
router.post("/project/create",genricRateLimiter(15, 300),authenticate,createProject);
router.get("/project-details-depth/:projectId",genricRateLimiter(15, 300),authenticate,getProjectDetailsDepth)
router.delete("/project-delete/:projectId",genricRateLimiter(15, 300),authenticate,deleteProject)
router.patch("/project-pause/:projectId",genricRateLimiter(15, 300),authenticate,pauseProject)
export default router;