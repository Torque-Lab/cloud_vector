import { Router } from "express";
import { signUp, signIn, forgotPassword, resetPassword, logout, refresh, csurf, verifyOTP, getSession } from "../../controller/auth/auth.controller";
import { startGoogleAuth,googleCallbackMiddleware,handleGoogleCallback } from "../../controller/auth/auth.google";
import { startGithubAuth,githubCallbackMiddleware,handleGithubCallback } from "../../controller/auth/auth.github";
import { authenticate } from "../../middlware/auth.middlware";
import { genricRateLimiter } from "../../middlware/ratelimit.middlware";
const router = Router();
router.post("/signup",genricRateLimiter(600, 30), signUp);
router.post("/otp-verification",genricRateLimiter(600, 30), verifyOTP);
router.post("/signin",genricRateLimiter(600, 30), signIn);
router.post("/forgot",genricRateLimiter(600, 30), forgotPassword);
router.post("/reset",genricRateLimiter(600, 30), resetPassword);
router.post("/logout",genricRateLimiter(60, 30), logout);
router.post("/refresh",genricRateLimiter(15, 30), refresh);
router.get("/session",genricRateLimiter(15, 30),authenticate,getSession)
router.get("/csurf",genricRateLimiter(15, 300), csurf);
router.get("/google",genricRateLimiter(15, 300), startGoogleAuth());
router.get("/github",genricRateLimiter(15, 300), startGithubAuth());

router.get("/google/callback",genricRateLimiter(15, 300), googleCallbackMiddleware, handleGoogleCallback);
router.get("/github/callback",genricRateLimiter(15, 300), githubCallbackMiddleware, handleGithubCallback);
export default router;
