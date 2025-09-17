import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import { config } from "../configs/server.config.js";

export function generateAuthenticationTokens(user: User) {
  const payload = {
    userId: user.id,
    roleName: user.role_id,
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
