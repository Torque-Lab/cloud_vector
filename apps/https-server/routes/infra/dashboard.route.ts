
import Router from "express";
import { deleteProject, getDashboardData, pauseProject } from "../../controller/dashboard/dashboard.controller";
import { authenticate } from "../../middlware/auth.middlware";
import { getProjectDetailsDepth } from "../../controller/dashboard/dashboard.controller";
import { genricRateLimiter } from "../../middlware/ratelimit.middlware";
const router=Router()
router.get("/dashboard",genricRateLimiter(15, 300),authenticate,getDashboardData)
router.get("/project-details-depth/:projectId",genricRateLimiter(15, 300),authenticate,getProjectDetailsDepth)
router.delete("/project-delete/:projectId",genricRateLimiter(15, 300),authenticate,deleteProject)
router.patch("/project-pause/:projectId",genricRateLimiter(15, 300),authenticate,pauseProject)
export default router
