import type { Request, Response } from "express";
import { prisma } from "../models/index.js";
import { utilSchema } from "../schemas/utils.schema.js";
import { NotFoundError, UnauthorizedError } from "../lib/errors.js";

const usersController = {
  // --------------------  Get ALl Users ------------------------

  async getAllUsers(req: Request, res: Response) {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  },

  // --------------------  Get One User ------------------------
  async getOneUser(req: Request, res: Response) {
    const { id } = utilSchema.parseId.parse(req.params);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    res.status(200).json(user);
  },

  // --------------------  Get My Account ------------------------
  async getMyAccount(req: Request, res: Response) {
    if (!req.userId) {
      throw new UnauthorizedError("Unauthorized");
    }
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    res.status(200).json(user);
  },
};

export default usersController;
