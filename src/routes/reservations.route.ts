import { Router } from "express";

import reservationsController from "../controllers/reservations.controller.js";
import { checkRoles } from "../middlewares/check-roles.middleware.js";

const router = Router();

// ====================  ADMIN ROUTES ========================
router.get(
    "/",
    checkRoles(["admin"]),
    reservationsController.getAllOrders
  );

// ====================  MEMBER ROUTES ========================
router.get(
  "/user/:user_id",
  checkRoles(["admin", "member"]),
  reservationsController.getUserOrders
);

// ====================  PUBLIC ROUTES ========================




export default router;