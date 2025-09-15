import type { Request, Response } from "express";
import { prisma } from "../models/index.js";

const usersController = {
  async getAllUsers(req: Request, res: Response) {
    const users = await prisma.user.findMany();
    console.log("users", users);
    res.status(200).json(users);
  },
};

export default usersController;
