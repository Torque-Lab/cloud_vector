
import Router from "express";
import { deleteProject, getDashboardData, pauseProject } from "../../controller/dashboard/dashboard.controller";
import { authenticate } from "../../middlware/auth.middlware";
import { getProjectDetailsDepth } from "../../controller/dashboard/dashboard.controller";
const router=Router()
router.get("/dashboard",authenticate,getDashboardData)
router.get("/project-details-depth/:projectId",authenticate,getProjectDetailsDepth)
router.delete("/project-delete/:projectId",authenticate,deleteProject)
router.patch("/project-pause/:projectId",authenticate,pauseProject)
export default router
