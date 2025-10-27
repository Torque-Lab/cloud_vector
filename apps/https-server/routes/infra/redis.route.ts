
import { Router } from "express";
import { authenticate } from "../../middlware/auth.middlware";
import { createRedisInstance,deleteRedisInstance,resetRedisInstance,getAllRedisInstance,getOneRedisInstance,getRedisConnectionString} from "../../controller/infra/redis.controller";
import { genricRateLimiter } from "../../middlware/ratelimit.middlware";
const router=Router();
router.get("/all-redis",genricRateLimiter(15, 300),authenticate,getAllRedisInstance);
router.get("/redis-get/:id",genricRateLimiter(15, 300),authenticate,getOneRedisInstance)
router.post("/redis-create",genricRateLimiter(15, 300),authenticate,createRedisInstance);
router.patch("/redis-reset/:id",genricRateLimiter(15, 300),authenticate,resetRedisInstance);
router.delete("/redis-delete/:id",genricRateLimiter(15, 300),authenticate,deleteRedisInstance);
router.get("/redis-connection/:id",genricRateLimiter(15, 300),authenticate,getRedisConnectionString);

export default router;
