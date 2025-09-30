import { Router } from "express";

import { usersController } from "../controllers/users.controller.js";
import { checkRoles } from "../middlewares/check-roles.middleware.js";
import { limiterUser } from "../middlewares/rate-limit.middleware.js";

const router = Router();

// ====================  MEMBER ROUTES ========================

// --------------------  Get My Account --------------------
router.get(
  "/me",
  limiterUser,
  checkRoles(["admin", "member"]),
  usersController.getMyAccount
);

// --------------------  Update Password --------------------
router.patch(
  "/change-password",
  limiterUser,
  checkRoles(["admin", "member"]),
  usersController.updateUserPassword
);

// --------------------  Update Info --------------------
router.patch(
  "/",
  limiterUser,
  checkRoles(["admin", "member"]),
  usersController.updateUserInfo
);

// --------------------  Delete User --------------------
router.delete("/", checkRoles(["admin", "member"]), usersController.deleteUser);

// ====================  ADMIN ROUTES ========================

// --------------------  Get All Users --------------------
router.get(
  "/",
  limiterUser,
  checkRoles(["admin"]),
  usersController.getAllUsers
);

// --------------------  Get One User --------------------
router.get(
  "/:id",
  limiterUser,
  checkRoles(["admin"]),
  usersController.getOneUser
);

// --------------------  Update Role User --------------------
router.patch(
  "/:id/role",
  limiterUser,
  checkRoles(["admin"]),
  usersController.updateRoleUser
);

// --------------------  Delete User Account --------------------
router.delete(
  "/:id",
  limiterUser,
  checkRoles(["admin"]),
  usersController.deleteUserAccount
);

export default router;
