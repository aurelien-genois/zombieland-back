import { Router } from "express";

import activitiesController from "../controllers/activities.controller.js";
import { checkRoles } from "../middlewares/check-roles.middleware.js";

const router = Router();

// ====================  ADMIN ROUTES ========================
router.get(
  "/all",
  checkRoles(["admin"]),
  activitiesController.getAllActivities.bind(null, {})
);
router.get(
  "/all/:slug",
  checkRoles(["admin"]),
  activitiesController.getOneActivity.bind(null, {})
);

router.post("/", checkRoles(["admin"]), activitiesController.createActivity);
router.patch(
  "/:id",
  checkRoles(["admin"]),
  activitiesController.updateActivity
);
router.delete(
  "/:id",
  checkRoles(["admin"]),
  activitiesController.deleteActivity
);

router.patch(
  "/:id/publish",
  checkRoles(["admin"]),
  activitiesController.publishActivity
);

// ====================  MEMBER ROUTES ========================
router.post(
  "/:id/evaluate",
  checkRoles(["admin", "member"]),
  activitiesController.evaluateActivity
);

// ====================  PUBLIC ROUTES ========================
router.get(
  "/",
  activitiesController.getAllActivities.bind(null, { status: "published" })
);

router.get(
  "/:slug",
  activitiesController.getOneActivity.bind(null, { status: "published" })
);

export default router;
