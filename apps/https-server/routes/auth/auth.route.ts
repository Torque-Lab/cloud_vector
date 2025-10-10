import { Router } from "express";
import { signUp, signIn, forgotPassword, resetPassword, logout, refresh, csurf, verifyOTP, getSession } from "../../controller/auth/auth.controller";
import { startGoogleAuth,googleCallbackMiddleware,handleGoogleCallback } from "../../controller/auth/auth.google";
import { startGithubAuth,githubCallbackMiddleware,handleGithubCallback } from "../../controller/auth/auth.github";
import { authenticate } from "../../middlware/auth.middlware";
const router = Router();
router.post("/signup", signUp);
router.post("/otp-verification", verifyOTP);
router.post("/signin", signIn);
router.post("/forgot", forgotPassword);
router.post("/reset", resetPassword);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/session",authenticate,getSession)
router.get("/csurf", csurf);
router.get("/google", startGoogleAuth());
router.get("/github", startGithubAuth());

router.get("/google/callback", googleCallbackMiddleware, handleGoogleCallback);
router.get("/github/callback", githubCallbackMiddleware, handleGithubCallback);
export default router;
