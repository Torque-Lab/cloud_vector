
import { Router } from "express";
import { authenticate } from "../../middlware/auth.middlware";
import { createPostgresInstance, deletePostgresInstance, getAllPostgresInstance, getOnePostgresInstance, getPostgresConnectionString, resetPostgresInstance} from "../../controller/infra/postgres.controller";
const router=Router();


router.get("/all-postgresql",authenticate,getAllPostgresInstance);
router.get("/postgresql-get/:id",authenticate,getOnePostgresInstance);
router.post("/postgresql-create",authenticate,createPostgresInstance);
router.patch("/postgresql-reset/:id",authenticate,resetPostgresInstance);
router.delete("/postgresql-delete/:id",authenticate,deletePostgresInstance);
router.get("/postgresql-connection/:id",authenticate,getPostgresConnectionString);

export default router;
