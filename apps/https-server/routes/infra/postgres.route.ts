
import { Router } from "express";
import { authenticate } from "../../middlware/auth.middlware";
import { createPostgresInstance, deletePostgresInstance, getAllPostgresInstance, getOnePostgresInstance, getPostgresConnectionString, resetPostgresInstance} from "../../controller/infra/postgres.controller";
import { genricRateLimiter } from "../../middlware/ratelimit.middlware";
const router=Router();


router.get("/all-postgresql",genricRateLimiter(15, 300),authenticate,getAllPostgresInstance);
router.get("/postgresql-get/:id",genricRateLimiter(15, 300),authenticate,getOnePostgresInstance);
router.post("/postgresql-create",genricRateLimiter(15, 300),authenticate,createPostgresInstance);
router.patch("/postgresql-reset/:id",genricRateLimiter(15, 300),authenticate,resetPostgresInstance);
router.delete("/postgresql-delete/:id",genricRateLimiter(15, 300),authenticate,deletePostgresInstance);
router.get("/postgresql-connection/:id",genricRateLimiter(15, 300),authenticate,getPostgresConnectionString);

export default router;
