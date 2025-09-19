import type { Role } from "@prisma/client";
import "express";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: Role;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  userId: number;
  userRole: Role;
}
