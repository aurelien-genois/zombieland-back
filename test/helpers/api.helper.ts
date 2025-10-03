// test/helpers/api.helper.ts
import { generateAuthenticationTokens } from "../../src/lib/token.js";
import { User, RoleName } from "@prisma/client";

export const apiBaseUrl = `http://localhost:7357/api`;

export const authedRequester = buildAuthedRequester(buildFakeUser());

export function buildAuthedRequester(
  user: User & { role: { name: RoleName } }
) {
  const { accessToken } = generateAuthenticationTokens(user);

  return {
    async get(endpoint: string, options: RequestInit = {}) {
      return fetch(`${apiBaseUrl}${endpoint}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        ...options,
      });
    },
    // Ajoute post, put, delete si besoin
  };
}

export function buildFakeUser(
  user?: Partial<User & { role: { name: RoleName } }>
): User & { role: { name: RoleName } } {
  return {
    id: 1000000,
    firstname: "Admin",
    lastname: "Fake",
    email: `user${Math.random()}${Date.now()}@zombieland.com`,
    password: "P4$$w0rd",
    role_id: 1,
    role: { name: RoleName.admin },
    is_active: true,
    last_login: new Date(),
    phone: "0123456789",
    birthday: new Date("1990-01-01"),
    created_at: new Date(),
    updated_at: new Date(),
    ...user,
  };
}

export function buildFakeMember(
  user?: Partial<User & { role: { name: RoleName } }>
): User & { role: { name: RoleName } } {
  return buildFakeUser({
    role_id: 2,
    role: { name: RoleName.member },
    ...user,
  });
}

export const unauthenticatedRequester = {
  async get(endpoint: string, options: RequestInit = {}) {
    return fetch(`${apiBaseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  },
};
