import { Router } from "express";
import users from "./users.route.js";
import auth from "./auth.route.js";
import activities from "./activities.route.js";
import tests from "./tests.route.js";

export const router = Router();

router.use("/users", users);
router.use("/auth", auth);
router.use("/activities", activities);
router.use("/tests", tests);
