import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import type { User, RoleName } from "@prisma/client";
import { config } from "../configs/server.config.js";
import { UnauthorizedError } from "./errors.js";

export function generateAuthenticationTokens(
  user: User & { role?: { name: RoleName } | null }
) {
  if (!user.id || !user.role?.name) {
    throw new UnauthorizedError(
      "User authentication failed - invalid user data"
    );
  }

  const payload = {
    userId: user.id,
    role: user.role?.name,
  };

  const accessToken = jwt.sign(payload, config.server.jwtSecret, {
    expiresIn: "1h",
  });
  const refreshToken = crypto.randomBytes(128).toString("base64");

  return {
    accessToken: {
      token: accessToken,
      type: "Bearer",
      expiresInMS: 1 * 60 * 60 * 1000,
    },
    refreshToken: {
      token: refreshToken,
      type: "Bearer",
      expiresInMS: 7 * 24 * 60 * 60 * 1000,
    },
  };
}
