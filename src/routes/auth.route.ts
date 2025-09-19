import { Router } from "express";

import authController from "../controllers/auth.controller.js";

const router = Router();

// --------------------  Register ------------------------
router.post("/register", authController.register);

// --------------------  Confirmation Email ------------------------
router.get(
  "/email-confirmation",
  authController.sendConfirmationEmailWithToken
);

// --------------------  Resend Confirmation Email ------------------------
router.post(
  "/resend-email-confirmation",
  authController.resendConfirmationEmail
);

// --------------------  Login ---------------------------
router.post("/login", authController.login);

// --------------------  Logout ---------------------------
router.get("/logout", authController.logout);

// --------------------  Refresh Token ------------------------
router.post("/refresh", authController.refreshAccessToken);

export default router;
