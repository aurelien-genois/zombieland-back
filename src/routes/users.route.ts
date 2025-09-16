import { Router } from "express";

import usersController from "../controllers/users.controller.js";
import authController from "../controllers/auth.controller.js";

const router = Router();

// --------------------  Get All Users ------------------------
router.get("/", usersController.getAllUsers);

// --------------------  Register ------------------------
router.post("/register", authController.registerUser);

export default router;
