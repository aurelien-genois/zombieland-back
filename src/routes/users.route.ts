import { Router } from "express";

import usersController from "../controllers/users.controller.js";

const router = Router();

// --------------------  Get All Users --------------------
router.get("/", usersController.getAllUsers);

export default router;
