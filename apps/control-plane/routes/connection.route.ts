import { Router } from "express";
import { getPostgresInstance } from "../controllers/pg_connection";

const router = Router();

router.post("/postgres", getPostgresInstance);

export default router;
