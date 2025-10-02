import { Router } from "express";

import administrationController from "../controllers/administrition.controller.js";

const router = Router();

// ====================  ADMINISTRATION ROUTES =======================
router.post("/contact", administrationController.contact);

router.post("/pdf", administrationController.pdf);

export default router;
