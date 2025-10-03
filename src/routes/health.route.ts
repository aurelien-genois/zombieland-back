import { Router } from "express";
// import { emailTest } from "../services/emails/emailManager.service.js";
import healthController from "../controllers/health.controller.js";
import { emailTest } from "../services/emails/config/emailManager.service.js";

const router = Router();

// --------------------  Health -----------------------
router.get("/", healthController.checking);

// --------------------  Email Health --------------------
router.get("/email", emailTest);

export default router;
