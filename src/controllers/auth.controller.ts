import type { Request, Response } from "express";
import { prisma } from "../models/index.js";
import { userSchema } from "../schemas/user.schema.js";
import bcrypt from "bcrypt";

const authController = {
  // --------------------  Register User ------------------------

  async registerUser(req: Request, res: Response) {
    try {
      const result = userSchema.register.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          error: result.error?.issues[0]?.message,
        });
      }
      const { email, password } = result.data;

      const userWithSameEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (userWithSameEmail) {
        return res
          .status(409)
          .json({ errorMessage: "This email is already in use." });
      }

      const SALT = process.env.SALT_ROUNDS;
      if (!SALT) {
        throw new Error("SALT_ROUNDS is not defined in environment variables.");
      }
      const nbOfSaltRounds = parseInt(SALT);
      const encryptedPassword = await bcrypt.hash(password, nbOfSaltRounds);

      const user = await prisma.user.create({
        data: {
          firstname: result.data.firstname,
          lastname: result.data.lastname,
          email,
          password: encryptedPassword,
          is_active: true,
          phone: result.data.phone,
          birthday: result.data.birthday,
        },
      });
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default authController;
