import { Router } from "express";

import usersController from "../controllers/users.controller.js";
import { checkRoles } from "../middlewares/check-roles.middleware.js";

const router = Router();

// ====================  MEMBER ROUTES ========================

// --------------------  Get My Account --------------------
router.get(
  "/me",
  checkRoles(["admin", "member"]),
  usersController.getMyAccount
);

// --------------------  Update Password --------------------
router.patch(
  "/change-password",
  checkRoles(["admin", "member"]),
  usersController.updateUserPassword
);

// --------------------  Update Info --------------------
router.patch(
  "/",
  checkRoles(["admin", "member"]),
  usersController.updateUserInfo
);

// --------------------  Delete User --------------------
router.delete("/", checkRoles(["admin", "member"]), usersController.deleteUser);

// ====================  ADMIN ROUTES ========================

// --------------------  Get All Users --------------------
router.get("/", checkRoles(["admin"]), usersController.getAllUsers);

// --------------------  Get One User --------------------
router.get("/:id", checkRoles(["admin"]), usersController.getOneUser);

// --------------------  Update Role User --------------------
router.patch(
  "/:id/role",
  checkRoles(["admin"]),
  usersController.updateRoleUser
);

// --------------------  Delete User Account --------------------
router.delete("/:id", checkRoles(["admin"]), usersController.deleteUserAccount);

export default router;
