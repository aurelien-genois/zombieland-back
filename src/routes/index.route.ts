import { Router } from "express";
import users from "./users.route.js";
import auth from "./auth.route.js";
import activities from "./activities.route.js";

export const router = Router();

router.get("/health", (_req, res) => res.send("All good here!"));

router.use("/users", users);
router.use("/auth", auth);
router.use("/activities", activities);
