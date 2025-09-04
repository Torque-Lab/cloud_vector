import { Router } from "express";
import { signUp, signIn, forgotPassword, resetPassword, logout, refresh, csurf } from "../../controller/auth/auth.controller";
import { startGoogleAuth,googleCallbackMiddleware,handleGoogleCallback } from "../../controller/auth/auth.google";
import { startGithubAuth,githubCallbackMiddleware,handleGithubCallback } from "../../controller/auth/auth.github";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/forgot", forgotPassword);
router.post("/reset", resetPassword);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.post("/csurf", csurf);
router.post("/google", startGoogleAuth());
router.post("/github", startGithubAuth());

router.post("/google/callback", googleCallbackMiddleware, handleGoogleCallback);
router.post("/github/callback", githubCallbackMiddleware, handleGithubCallback);
export default router;
