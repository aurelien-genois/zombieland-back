import { Router } from "express";
import { emailTest } from "../services/emailManager.service.js";

const router = Router();

// --------------------  Health -----------------------
router.get("/", (_req, res) => res.send("All good here!"));

// --------------------  Email Health --------------------
router.get("/email", emailTest);

export default router;
