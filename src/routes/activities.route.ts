import { Router } from "express";

import activitiesController from "../controllers/activities.controller.js";
import { checkRoles } from "../middlewares/check-roles.middleware.js";

const router = Router();

// only admin users can access all activities
router.get(
  "/",
  checkRoles(["admin"]),
  activitiesController.getAllActivities.bind(null, {})
);

// everyone can access published activities
router.get(
  "/published",
  activitiesController.getAllActivities.bind(null, { status: "published" })
);

// /:slug after /published to avoid conflict
router.get("/:slug", activitiesController.getOneActivity);

router.post("/", activitiesController.createActivity);
router.patch("/:id", activitiesController.updateActivity);
router.delete("/:id", activitiesController.deleteActivity);

export default router;
