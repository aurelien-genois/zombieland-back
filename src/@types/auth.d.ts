import type { RoleName } from "@prisma/client";

export interface IAuthTokens {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: {
    name: RoleName;
    id: number;
    created_at: Date;
    updated_at: Date;
  } | null;
}
