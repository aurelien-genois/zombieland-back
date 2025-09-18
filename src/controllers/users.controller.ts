import type { Request, Response } from "express";
import { prisma } from "../models/index.js";

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
};

export default usersController;
