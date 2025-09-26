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

router.get(
  "/:id",
  checkRoles(["admin", "member"]),
  reservationsController.getOneOrder
);

router.post(
  "/",
  checkRoles(["admin", "member"]),
  reservationsController.createOrder
);
router.post(
  "/:id/lines",
  checkRoles(["admin", "member"]),
  reservationsController.addOrderLines
);

router.patch(
  "/lines/:lineId",
  checkRoles(["admin", "member"]),
  reservationsController.updateOrderLine
);

router.delete(
  "/lines/:lineId",
  checkRoles(["admin", "member"]),
  reservationsController.deleteOrderLine
);

// ====================  PUBLIC ROUTES ========================




export default router;