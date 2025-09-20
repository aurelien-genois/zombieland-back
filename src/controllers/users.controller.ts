import type { Request, Response } from "express";
import { prisma } from "../models/index.js";
import { utilSchema } from "../schemas/utils.schema.js";
import { NotFoundError, UnauthorizedError } from "../lib/errors.js";
import { usersSchema } from "../schemas/users.schema.js";
import bcrypt from "bcrypt";

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

  // --------------------  Update User Password ------------------------
  async updateUserPassword(req: Request, res: Response) {
    if (!req.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const { oldPassword, newPassword } =
      await usersSchema.changePassword.parseAsync(req.body);

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      throw new NotFoundError("User Not Found");
    }

    const isMatching = await bcrypt.compare(oldPassword, user.password);

    if (!isMatching) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const SALT = process.env.SALT_ROUNDS;
    if (!SALT) {
      throw new Error("SALT_ROUNDS is not defined in environment variables.");
    }
    const nbOfSaltRounds = parseInt(SALT);
    const encryptedPassword = await bcrypt.hash(newPassword, nbOfSaltRounds);

    await prisma.user.update({
      data: { password: encryptedPassword },
      where: { id: req.userId },
    });
    res.status(200).json({ message: "Password updated successfully" });
  },
};

export default usersController;
