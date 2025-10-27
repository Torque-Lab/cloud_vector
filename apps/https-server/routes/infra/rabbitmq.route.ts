
import { Router } from "express";
import { authenticate } from "../../middlware/auth.middlware";
import { createRabbitInstance,deleteRabbitMQInstance,resetRabbitInstance,getAllRabbitMQInstance,getOneRabbitMQInstance,getRabbitMQConnectionString} from "../../controller/infra/rabbitmq.controller";
import { genricRateLimiter } from "../../middlware/ratelimit.middlware";
const router=Router();
router.get("/all-rabbitmq",genricRateLimiter(15, 300),authenticate,getAllRabbitMQInstance);
router.get("/rabbitmq-get/:id",genricRateLimiter(15, 300),authenticate,getOneRabbitMQInstance)
router.post("/rabbitmq-create",genricRateLimiter(15, 300),authenticate,createRabbitInstance);
router.patch("/rabbitmq-reset/:id",genricRateLimiter(15, 300),authenticate,resetRabbitInstance);
router.delete("/rabbitmq-delete/:id",genricRateLimiter(15, 300),authenticate,deleteRabbitMQInstance);
router.get("/rabbitmq-connection/:id",genricRateLimiter(15, 300),authenticate,getRabbitMQConnectionString);

export default router;
