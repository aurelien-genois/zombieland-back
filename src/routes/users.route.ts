import { Router } from "express";

import usersController from "../controllers/users.controller.js";
import { checkRoles } from "../middlewares/check-roles.middleware.js";

const router = Router();

// --------------------  Get All Users --------------------
router.get("/", checkRoles(["admin"]), usersController.getAllUsers);

// --------------------  Get My Account --------------------
router.get("/me", checkRoles(["admin", "user"]), usersController.getMyAccount);

// --------------------  Get One User --------------------
router.get("/:id", checkRoles(["admin"]), usersController.getOneUser);

export default router;
