import { Router } from "express";

import authController from "../controllers/auth.controller.js";
import {
  limiterEmail,
  limiterLogin,
  limiterRegister,
} from "../middlewares/rate-limit.middleware.js";

const router = Router();

// --------------------  Register ----------------------------
router.post("/register", limiterRegister, authController.register);

// --------------------  Confirmation Email ------------------------
router.get(
  "/email-confirmation",
  limiterEmail,
  authController.checkConfirmationEmailWithToken
);

// --------------------  Resend Confirmation Email ------------------------
router.post(
  "/resend-email-confirmation",
  authController.resendConfirmationEmail
);

// --------------------  Login -------------------------------
router.post("/login", limiterLogin, authController.login);

// --------------------  Logout ---------------------------
router.get("/logout", authController.logout);

// --------------------  Refresh Token ------------------------
router.post("/refresh", authController.refreshAccessToken);

// --------------------  1) Forgot Password Request ------------------------
router.post(
  "/forgot-password",
  limiterEmail,
  authController.forgotPasswordRequest
);

// --------------------  2) Reset Password ------------------------
router.patch("/reset-password", authController.resetPassword);

export default router;
