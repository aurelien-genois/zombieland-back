import { Router } from "express";

import activitiesController from "../controllers/activities.controller.js";

const router = Router();

router.get("/", activitiesController.getAllActivities);

export default router;
