import express, { Router } from "express";
import reservationsController from "../../controllers/reservations.controller.js";

export const stripeIPNRouter = Router();

stripeIPNRouter.post(
  "/",
  express.raw({ type: "application/json" }),
  reservationsController.ipn
);