import type { Request, Response } from "express";
import { prisma } from "../models/index.js";
import { userSchema } from "../schemas/users.schema.js";
import type { User } from "@prisma/client";
import * as z from "zod";
import bcrypt from "bcrypt";
import { generateAuthenticationTokens } from "../lib/token.js";
import { config } from "../configs/server.config.js";

interface Token {
  token: string;
  type: string;
  expiresInMS: number;
}

async function replaceRefreshTokenInDatabase(token: Token, user: User) {
  const result = await prisma.token.deleteMany({ where: { user_id: user.id } });
  console.log(">>delete result", result);
  await prisma.token.create({
    data: {
      token: token.token,
      type: "refresh",
      user_id: user.id,
      expired_at: new Date(new Date().valueOf() + token.expiresInMS),
    },
  });
}

function setAccessTokenCookie(res: Response, accessToken: Token) {
  res.cookie("accessToken", accessToken.token, {
    httpOnly: true,
    maxAge: accessToken.expiresInMS,
    secure: config.server.secure,
  });
}

function setRefreshTokenCookie(res: Response, refreshToken: Token) {
  res.cookie("refreshToken", refreshToken.token, {
    httpOnly: true,
    maxAge: refreshToken.expiresInMS,
    secure: config.server.secure,
    path: "/api/auth/refresh",
  });
}

const authController = {
  // --------------------  Register User ------------------------
  async register(req: Request, res: Response) {
    try {
      const { email, password, firstname, lastname, phone, birthday } =
        await userSchema.register.parseAsync(req.body);

      console.log(">>body", req.body);

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
          firstname,
          lastname,
          email,
          password: encryptedPassword,
          is_active: true,
          phone,
          birthday,
        },
      });
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(">ZOD<", error.issues[0].message);
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // --------------------  Login User ------------------------
  async login(req: Request, res: Response) {
    try {
      const { email, password } = userSchema.login.parse(req.body);

      console.log(">>body", req.body);
      const user = await prisma.user.findFirst({ where: { email } });
      console.log(">>user", user);

      if (!user) {
        throw new Error("Email and password do not match");
      }

      const isMatching = await bcrypt.compare(password, user.password);
      console.log(">>isMatching", isMatching);

      if (!isMatching) {
        throw new Error("Email and password do not match");
      }

      const { accessToken, refreshToken } = generateAuthenticationTokens(user);
      console.log(">>tokens", { accessToken, refreshToken });

      await replaceRefreshTokenInDatabase(refreshToken, user);

      await prisma.token.create({
        data: {
          token: "15648",
          type: "REFRESH",
          user_id: 1,
          expired_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        },
      });

      setAccessTokenCookie(res, accessToken);
      setRefreshTokenCookie(res, refreshToken);

      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(">ZOD<", error.issues[0].message);
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default authController;
