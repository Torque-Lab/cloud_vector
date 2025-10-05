
import { Router } from "express";
import { authenticate } from "../../middlware/auth.middlware";
import { createPostgresInstance, deletePostgresInstance, getAllPostgresInstance, getOnePostgresInstance, updatePostgresInstance } from "../../controller/infra/postgres.controller";
const router=Router();


router.get("/all-postgresql",authenticate,getAllPostgresInstance);
router.get("/postgresql-get",authenticate,getOnePostgresInstance);
router.post("/postgresql-create",authenticate,createPostgresInstance);
router.patch("/postgresql-update",authenticate,updatePostgresInstance);
router.delete("/postgresql-delete",authenticate,deletePostgresInstance);
export default router;
