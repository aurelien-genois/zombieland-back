import { Router } from "express";

import activitiesController from "../controllers/activities.controller.js";
import { checkRoles } from "../middlewares/check-roles.middleware.js";

const router = Router();

// only admin users can access all activities
router.get(
  "/",
  checkRoles(["admin"], true), // Make authentication optional
  activitiesController.getAllActivities
);

// everyone can access a single activity but need "checkRoles" to get req.user
// and verifify if user can access draft activities
router.get(
  "/:slug",
  checkRoles(["admin"], true), // Make authentication optional
  activitiesController.getOneActivity
);

router.post("/", activitiesController.createActivity);
router.patch("/:id", activitiesController.updateActivity);
router.delete("/:id", activitiesController.deleteActivity);

export default router;
