
import Router from "express";
import { getAccount } from "../../controller/account/account.controller";
import { authenticate } from "../../middlware/auth.middlware";
import { genricRateLimiter } from "../../middlware/ratelimit.middlware";
const router=Router()
router.get("/settings/account",genricRateLimiter(15, 600),authenticate,getAccount)
export default router