// test/helpers/api.helper.ts
import { IAuthTokens } from "../../src/@types/auth.js";
import { generateAuthenticationTokens } from "../../src/lib/token.js";
import { RoleName } from "@prisma/client";

export const apiBaseUrl = `http://localhost:7357/api`;

export const authedRequester = buildAuthedRequester(buildFakeUser());

export function buildAuthedRequester(user: IAuthTokens) {
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
    async post(endpoint: string, options: RequestInit = {}) {
      return fetch(`${apiBaseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        ...options,
      });
    },
    async patch(endpoint: string, options: RequestInit = {}) {
      return fetch(`${apiBaseUrl}${endpoint}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        ...options,
      });
    },
    async delete(endpoint: string, options: RequestInit = {}) {
      return fetch(`${apiBaseUrl}${endpoint}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        ...options,
      });
    },
  };
}

export function buildFakeUser(user?: Partial<IAuthTokens>): IAuthTokens {
  return {
    id: 1000000,
    firstname: "Admin",
    lastname: "Fake",
    email: `user${Math.random()}${Date.now()}@zombieland.com`,
    role: {
      name: RoleName.admin,
      id: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
    ...user,
  } as IAuthTokens;
}

export function buildFakeMember(user?: Partial<IAuthTokens>): IAuthTokens {
  return buildFakeUser({
    role: {
      name: RoleName.member,
      id: 2,
      created_at: new Date(),
      updated_at: new Date(),
    },
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
