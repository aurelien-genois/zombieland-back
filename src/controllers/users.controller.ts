import type { Request, Response } from "express";
import { prisma } from "../models/index.js";
import { utilSchema } from "../schemas/utils.schema.js";

const usersController = {
  // --------------------  Get ALl Users ------------------------

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // --------------------  Get One User ------------------------
  async getOneUser(req: Request, res: Response) {
    try {
      const { id } = utilSchema.parseId.parse(req.params);
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // --------------------  Get My Account ------------------------
  async getMyAccount(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const user = await prisma.user.findUnique({ where: { id: req.userId } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default usersController;
