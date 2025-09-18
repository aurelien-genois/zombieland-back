import { Router } from "express";
import { emailTest } from "../services/emailManager.service.js";

const router = Router();

// --------------------  Health -----------------------
router.get("/health", (_req, res) => res.send("All good here!"));

// --------------------  Email Test --------------------
router.get("/email-health", emailTest);

export default router;
