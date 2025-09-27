import type { RoleName } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { config } from "../configs/server.config.js";
import { UnauthorizedError } from "../lib/errors.js";

export function checkRoles(roles: RoleName[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = extractAccessToken(req);
    const { userId, role } = verifyAndDecodeJWT(token);
    if (!roles.includes(role)) {
      return res.status(403).json({ message: "Vous n'avez pas accès" });
    }
    req.userId = userId;
    req.userRole = role;
    next();
  };
}

function extractAccessToken(req: Request): string {
  if (typeof req.cookies?.accessToken === "string") {
    console.log("Access Token found in cookies", req.cookies.accessToken);
    return req.cookies.accessToken;
  }
  if (typeof req.headers?.authorization === "string") {
    return req.headers.authorization.split(" ")[1];
  }
  throw new UnauthorizedError("Access Token not provided");
}

function verifyAndDecodeJWT(accessToken: string): JwtPayload {
  try {
    const payload = jwt.verify(
      accessToken,
      config.server.jwtSecret
    ) as JwtPayload;

    return payload;
  } catch (error) {
    console.error(error);
    throw new UnauthorizedError("Invalid or expired access token");
  }
}
