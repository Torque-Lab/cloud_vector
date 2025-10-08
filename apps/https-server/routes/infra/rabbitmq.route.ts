
import { Router } from "express";
import { authenticate } from "../../middlware/auth.middlware";
import { createRabbitInstance,deleteRabbitMQInstance,resetRabbitInstance,getAllRabbitMQInstance,getOneRabbitMQInstance,getRabbitMQConnectionString} from "../../controller/infra/rabbitmq.controller";
const router=Router();
router.get("/all-rabbitmq",authenticate,getAllRabbitMQInstance);
router.get("/rabbitmq-get/:id",authenticate,getOneRabbitMQInstance)
router.post("/rabbitmq-create",authenticate,createRabbitInstance);
router.patch("/rabbitmq-reset/:id",authenticate,resetRabbitInstance);
router.delete("/rabbitmq-delete/:id",authenticate,deleteRabbitMQInstance);
router.get("/rabbitmq-connection/:id",authenticate,getRabbitMQConnectionString);

export default router;
