import type { Request, Response } from "express";
import { prisma } from "../models/index.js";
import { usersSchema } from "../schemas/users.schema.js";
import bcrypt from "bcrypt";
import { generateAuthenticationTokens } from "../lib/token.js";
import { config } from "../../server.config.js";
import { sendForgotPasswordRequest } from "../services/emails/messages/forgotPassword.js";
import { sendConfirmationEmail } from "../services/emails/messages/confirmation.js";
import { v4 as uuidv4 } from "uuid";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../lib/errors.js";
import type { IAuthTokens } from "../@types/auth.js";

interface Token {
  token: string;
  type: string;
  expiresInMS: number;
}

async function replaceRefreshTokenInDatabase(token: Token, user: IAuthTokens) {
  await prisma.token.deleteMany({
    where: { user_id: user.id, type: "refresh" },
  });
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
    const { email, password, firstname, lastname, phone, birthday } =
      await usersSchema.register.parseAsync(req.body);

    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (userWithSameEmail) {
      throw new ConflictError("This email is already in use.");
    }

    const SALT = process.env.SALT_ROUNDS;
    if (!SALT) {
      throw new Error("SALT_ROUNDS is not defined in environment variables.");
    }
    const nbOfSaltRounds = parseInt(SALT);
    const encryptedPassword = await bcrypt.hash(password, nbOfSaltRounds);
    const verificationToken = uuidv4();

    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: encryptedPassword,
        role_id: 2,
        phone,
        birthday,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
        birthday: true,
        is_active: true,
        last_login: true,
        created_at: true,
        updated_at: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const userToken = await prisma.token.create({
      data: {
        token: verificationToken,
        type: "verification_email",
        user_id: user.id,
        expired_at: new Date(new Date().valueOf() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    await sendConfirmationEmail(
      user.email,
      userToken.token,
      user.firstname,
      user.lastname
    );

    res.status(201).json(user);
  },
  // --------------------  Send Confirmation Email With Token------------------------
  async checkConfirmationEmailWithToken(req: Request, res: Response) {
    const { token } = await usersSchema.token.parseAsync(req.query);
    const userToken = await prisma.token.findFirst({
      where: { token, type: "verification_email" },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
            is_active: true,
          },
        },
      },
    });

    if (userToken?.user?.is_active) {
      throw new ConflictError("This account is already active.");
    }

    if (!userToken) {
      throw new NotFoundError("Token not found.");
    }

    if (!userToken.expired_at || userToken.expired_at < new Date()) {
      throw new BadRequestError("Token has expired.");
    }

    if (userToken.user_id == null) {
      throw new BadRequestError("User ID is missing.");
    }

    await prisma.user.update({
      where: { id: userToken.user_id },
      data: { is_active: true },
    });

    await prisma.token.deleteMany({
      where: { user_id: userToken.user_id, type: "verification_email" },
    });

    res.redirect(`${config.server.frontUrl}/email-confirmation`);
  },
  // --------------------  Resend Confirmation Email ------------------------
  async resendConfirmationEmail(req: Request, res: Response) {
    const { email } = await usersSchema.email.parseAsync(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        is_active: true,
      },
    });

    if (!user) {
      throw new NotFoundError("No user found with this email.");
    }

    if (user.is_active) {
      throw new ConflictError("This account is already active.");
    }

    const verificationToken = uuidv4();

    const userToken = await prisma.token.create({
      data: {
        token: verificationToken,
        type: "verification_email",
        user_id: user.id,
        expired_at: new Date(new Date().valueOf() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    await sendConfirmationEmail(
      user.email,
      userToken.token,
      user.firstname,
      user.lastname
    );

    res.redirect(`${config.server.frontUrl}/login`);
  },

  // --------------------  Login User ------------------------
  async login(req: Request, res: Response) {
    const { email, password } = usersSchema.login.parse(req.body);

    const user = await prisma.user.findFirst({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      throw new NotFoundError("Email and password do not match");
    }

    if (!user?.is_active) {
      throw new ConflictError("This account is not active.");
    }

    const isMatching = await bcrypt.compare(password, user.password);

    if (!isMatching) {
      throw new BadRequestError("Email and password do not match");
    }

    const { accessToken, refreshToken } = generateAuthenticationTokens(user);

    await replaceRefreshTokenInDatabase(refreshToken, user);

    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    const { password: _pw, ...safeUser } = user;

    res.status(200).json({
      user: safeUser,
    });
  },

  // --------------------  Logout User ------------------------
  async logout(_req: Request, res: Response) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
    res.status(200).json({ message: "Logout successful." });
  },

  // --------------------  Refresh Token ------------------------

  async refreshAccessToken(req: Request, res: Response) {
    const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!rawToken) {
      throw new BadRequestError("Refresh token not provided");
    }

    const existingRefreshToken = await prisma.token.findFirst({
      where: { token: rawToken, type: "refresh" },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });
    if (
      !existingRefreshToken ||
      !existingRefreshToken.user ||
      !existingRefreshToken.user.role
    ) {
      throw new UnauthorizedError("Invalid refresh token");
    }
    if (
      !existingRefreshToken.expired_at ||
      existingRefreshToken.expired_at < new Date()
    ) {
      if (existingRefreshToken.id) {
        await prisma.token.delete({ where: { id: existingRefreshToken.id } });
      }
      throw new UnauthorizedError("Expired refresh token");
    }

    const { accessToken, refreshToken } = generateAuthenticationTokens(
      existingRefreshToken.user
    );

    await replaceRefreshTokenInDatabase(
      refreshToken,
      existingRefreshToken.user
    );

    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    res.json("New access token generated successfully.");
  },
  // --------------------  1) Forgot Password Request ------------------------
  async forgotPasswordRequest(req: Request, res: Response) {
    const { email } = await usersSchema.email.parseAsync(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new NotFoundError("No user found with this email.");
    }

    const resetToken = uuidv4();

    const userToken = await prisma.token.create({
      data: {
        token: resetToken,
        type: "reset_password",
        user_id: user.id,
        expired_at: new Date(new Date().valueOf() + 1 * 60 * 60 * 1000), // 1 hour
      },
    });

    await sendForgotPasswordRequest(user.email, userToken.token);

    res.status(200).json({
      message: "Forgot password Request sent successfully.",
    });
  },

  // --------------------  2) Reset Password ------------------------
  async resetPassword(req: Request, res: Response) {
    const { newPassword } = await usersSchema.resetPassword.parseAsync(
      req.body
    );

    const { token } = await usersSchema.token.parseAsync(req.query);
    const userToken = await prisma.token.findFirst({
      where: { token, type: "reset_password" },
      include: { user: true },
    });
    if (!userToken) {
      throw new NotFoundError("Token not found.");
    }

    if (!userToken.expired_at || userToken.expired_at < new Date()) {
      throw new BadRequestError("Token has expired.");
    }

    if (userToken.user_id == null) {
      throw new BadRequestError("User ID is missing.");
    }

    const SALT = process.env.SALT_ROUNDS;
    if (!SALT) {
      throw new Error("SALT_ROUNDS is not defined in environment variables.");
    }
    const nbOfSaltRounds = parseInt(SALT);
    const encryptedPassword = await bcrypt.hash(newPassword, nbOfSaltRounds);

    await prisma.user.update({
      where: { id: userToken.user_id },
      data: { password: encryptedPassword },
    });

    await prisma.token.deleteMany({
      where: { user_id: userToken.user_id, type: "reset_password" },
    });

    res.status(200).json({ message: "Password has been reset successfully." });
  },
};
export default authController;
