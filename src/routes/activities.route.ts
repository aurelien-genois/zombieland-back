import { Router } from "express";

import activitiesController from "../controllers/activities.controller.js";

const router = Router();

router.get("/", activitiesController.getAllActivities);
router.get("/:slug", activitiesController.getOneActivity);
router.post("/", activitiesController.createActivity);

export default router;
