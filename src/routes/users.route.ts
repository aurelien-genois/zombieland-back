import { Router } from "express";

import usersController from "../controllers/users.controller.js";
import { checkRoles } from "../middlewares/check-roles.middleware.js";

const router = Router();

// --------------------  Get All Users --------------------
router.get("/", checkRoles(["user"]), usersController.getAllUsers);

export default router;
