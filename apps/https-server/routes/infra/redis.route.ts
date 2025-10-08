
import { Router } from "express";
import { authenticate } from "../../middlware/auth.middlware";
import { createRedisInstance,deleteRedisInstance,resetRedisInstance,getAllRedisInstance,getOneRedisInstance,getRedisConnectionString} from "../../controller/infra/redis.controller";
const router=Router();
router.get("/all-redis",authenticate,getAllRedisInstance);
router.get("/redis-get/:id",authenticate,getOneRedisInstance)
router.post("/redis-create",authenticate,createRedisInstance);
router.patch("/redis-reset/:id",authenticate,resetRedisInstance);
router.delete("/redis-delete/:id",authenticate,deleteRedisInstance);
router.get("/redis-connection/:id",authenticate,getRedisConnectionString);

export default router;
