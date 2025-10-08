import { Router } from "express";

import administrationController from "../controllers/administration.controller.js";

const router = Router();

// ====================  ADMINISTRATION ROUTES =======================
router.post("/contact", administrationController.contact);

export default router;
