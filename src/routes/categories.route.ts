import { Router } from "express";

import categoriesController from "../controllers/categories.controller.js";
import { checkRoles } from "../middlewares/check-roles.middleware.js";

const router = Router();

// ====================  ADMIN ROUTES ========================
router.post("/", checkRoles(["admin"]), (req, res) =>
  categoriesController.create(req, res)
);
router.get("/:id", checkRoles(["admin"]), (req, res) =>
  categoriesController.getById(req, res)
);
router.patch("/:id", checkRoles(["admin"]), (req, res) =>
  categoriesController.updateById(req, res)
);
router.delete("/:id", checkRoles(["admin"]), (req, res) =>
  categoriesController.deleteById(req, res)
);

// ====================  PUBLIC ROUTES ========================
router.get("/", (req, res) => categoriesController.getAll(req, res));

export default router;
