import { Router } from "express";
import { authConnection } from "../controllers/auth_connection";

const router = Router();

router.post("/auth_connection", authConnection);

export default router;
