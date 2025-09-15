import { Router } from "express";

export const router = Router();

// Health check endpoint

router.get("/health", (_req, res) => res.send("All good here!"));
