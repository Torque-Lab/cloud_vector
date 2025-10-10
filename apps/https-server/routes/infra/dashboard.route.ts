
import Router from "express";
import { getDashboardData } from "../../controller/dashboard/dashboard.controller";
import { authenticate } from "../../middlware/auth.middlware";

const router=Router()
router.get("/dashboard",authenticate,getDashboardData)
export default router
