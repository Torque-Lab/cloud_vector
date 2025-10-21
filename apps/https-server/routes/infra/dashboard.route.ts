
import Router from "express";
import { getDashboardData } from "../../controller/dashboard/dashboard.controller";
import { authenticate } from "../../middlware/auth.middlware";
import { getProjectDetailsDepth } from "../../controller/dashboard/dashboard.controller";
const router=Router()
router.get("/dashboard",authenticate,getDashboardData)
router.get("/project-details-depth/:projectId",authenticate,getProjectDetailsDepth)
export default router
