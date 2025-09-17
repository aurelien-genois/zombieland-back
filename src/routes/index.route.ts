import { Router } from "express";
import users from "./users.route.js";
import auth from "./auth.route.js";

export const router = Router();

router.get("/health", (_req, res) => res.send("All good here!"));

router.use("/users", users);
router.use("/auth", auth);
