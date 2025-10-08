import type { RoleName } from "@prisma/client";

export interface IAuthTokens {
  id: number;
  email: string;
  role: {
    name: RoleName;
    id: number;
    created_at: Date;
    updated_at: Date;
  } | null;
}
