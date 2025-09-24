import { Router } from "express";

import reservationsController from "../controllers/reservations.controller.js";
import { checkRoles } from "../middlewares/check-roles.middleware.js";

const router = Router();

// ====================  ADMIN ROUTES ========================
router.get(
    "/all",
    checkRoles(["admin"]),
    reservationsController.getAllOrders
  );

// ====================  MEMBER ROUTES ========================


// ====================  PUBLIC ROUTES ========================




export default router;