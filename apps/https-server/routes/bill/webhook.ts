
import { Router } from "express";
import { stripeWebhookHandler } from "../../controller/bill/bill.controller";
import { genricRateLimiter } from "../../middlware/ratelimit.middlware";
import bodyParser from 'body-parser';

const router = Router();
router.post("/webhook", genricRateLimiter(1, 300),bodyParser.raw({ type: 'application/json' }), stripeWebhookHandler);


export default router