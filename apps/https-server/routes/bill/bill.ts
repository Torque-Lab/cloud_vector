
import { Router } from "express";
import {  createCustomer_subscription } from "../../controller/bill/bill.controller";
import { genricRateLimiter } from "../../middlware/ratelimit.middlware";
import { authenticate } from "../../middlware/auth.middlware";


const router = Router();
router.post("/create-subscription", genricRateLimiter(1, 300), authenticate,createCustomer_subscription);
export default router;
