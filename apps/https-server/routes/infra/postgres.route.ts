
import { Router } from "express";
import { authenticate } from "../../middlware/auth.middlware";
import { createPostgresInstance, deletePostgresInstance, getAllPostgresInstance, getOnePostgresInstance, getPostgresConnectionString, resetPostgresInstance} from "../../controller/infra/postgres.controller";
const router=Router();


router.get("/all-postgresql",authenticate,getAllPostgresInstance);
router.get("/postgresql-get",authenticate,getOnePostgresInstance);
router.post("/postgresql-create",authenticate,createPostgresInstance);
router.patch("/postgresql-reset",authenticate,resetPostgresInstance);
router.delete("/postgresql-delete",authenticate,deletePostgresInstance);
router.get("/postgresql-connection",authenticate,getPostgresConnectionString);

export default router;
