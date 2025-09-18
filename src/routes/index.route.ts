import { Router } from "express";
import users from "./users.route.js";
import auth from "./auth.route.js";
import activities from "./activities.route.js";
import health from "./health.route.js";

export const router = Router();

// --------------------  Health ------------------------
router.use("/health", health);

// --------------------  Users ------------------------
router.use("/users", users);

// --------------------  Auth ------------------------
router.use("/auth", auth);

// --------------------  Activities ------------------------
router.use("/activities", activities);
