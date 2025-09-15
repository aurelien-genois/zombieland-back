import { Router } from "express";
import users from "./users.route.js";

export const router = Router();

router.get("/health", (_req, res) => res.send("All good here!"));

router.use("/users", users);
