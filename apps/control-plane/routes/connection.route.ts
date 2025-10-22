import { Router } from "express";
import { getPostgresInstance ,updatePostgresRouteTable} from "../controllers/pg_connection";
import { getRedisInstance,updateRedisRouteTable } from "../controllers/redis_connection";
import { getRabbitInstance, updateRabbitMQRouteTable,  } from "../controllers/rabbit_connection";

const router = Router();

router.get("/postgres/route-table", getPostgresInstance);
router.post("/postgres/route-table-update", updatePostgresRouteTable);
router.get("/redis/route-table", getRedisInstance);
router.post("/redis/route-table-update", updateRedisRouteTable);
router.get("/rabbit/route-table", getRabbitInstance);
router.post("/rabbit/route-table-update", updateRabbitMQRouteTable);



export default router;
