import { Router } from "express";
import users from "./users.route.js";
import auth from "./auth.route.js";
import activities from "./activities.route.js";
import health from "./health.route.js";

export const router = Router();

router.use("/health", health);
router.use("/users", users);
router.use("/auth", auth);
router.use("/activities", activities);
