import { Router } from "express";

import newActivityController from "../controllers/act.controller.js";
import { checkRoles } from "../middlewares/check-roles.middleware.js";

const router = Router();

// (TEST BaseController)

router.get("/health", (req, res) => res.send("TEST"));

router.get("/", (req, res) => newActivityController.getAll(req, res));
router.get("/:id", (req, res) => newActivityController.getById(req, res));
router.post("/", checkRoles(["admin"]), (req, res) =>
  newActivityController.create(req, res)
);
router.patch("/:id", (req, res) => newActivityController.updateById(req, res));
router.delete("/:id", (req, res) => newActivityController.deleteById(req, res));

export default router;
