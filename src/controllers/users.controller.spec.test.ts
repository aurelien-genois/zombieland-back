import assert from "node:assert";
import { prisma } from "../models/index.js";
import { before, describe, it } from "node:test";
import bcrypt from "bcrypt";
import { generateAuthenticationTokens } from "../lib/token.js";
import { apiBaseUrl} from '../../test/helpers/api.helper.js'

// user with cookie
describe("Users Controller", () => {
  let adminToken: string;

  before(async () => {
    // 1. Crée les rôles avec upsert pour éviter les conflits
    await prisma.role.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, name: "admin" },
    });

    await prisma.role.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, name: "member" },
    });

    // 2. Crée un utilisateur ADMIN
    const hashedPassword = await bcrypt.hash("adminpassword", 10);

    const adminUser = await prisma.user.create({
      data: {
        firstname: "Admin",
        lastname: "Test43",
        email: "admin@test.com",
        password: hashedPassword,
        role_id: 1,
        is_active: true,
        phone: "0123456789",
        birthday: new Date("1990-01-01"), // Format Date correct
      },
      include: {
        role: true,
      },
    });

    // 3. Génère le token JWT
    const tokens = generateAuthenticationTokens(adminUser);
    adminToken = tokens.accessToken.token;
  });

  it("should get all users with admin token", async () => {
    const response = await fetch(`${apiBaseUrl}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    assert.strictEqual(response.status, 200, "Expected status 200");

    const users = await response.json();
    assert(Array.isArray(users.data), "Response 'data' should be an array");
    assert(users.data.length >= 0, "There should be zero or more users");
  });
});
