import assert from "node:assert";
import { prisma } from "../models/index.js";
import { before, beforeEach, describe, it } from "node:test";
import bcrypt from "bcrypt";

// --------------------  Register Test  ------------------------
describe("Auth Controller - Register", () => {
  before(async () => {
    await prisma.token.deleteMany();
    await prisma.user.deleteMany();
  });

  it("should register a new user", async () => {
    const newUser = {
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "1234567890",
      birthday: new Date("1990-01-01"),
    };

    const response = await prisma.user.create({
      data: newUser,
    });

    assert.strictEqual(response.firstname, newUser.firstname);
    assert.strictEqual(response.lastname, newUser.lastname);
    assert.strictEqual(response.email, newUser.email);
    assert.strictEqual(response.phone, newUser.phone);
    assert.strictEqual(
      response.birthday.toISOString(),
      newUser.birthday.toISOString()
    );
  });

  it("should not register a user with an existing email", async () => {
    const existingUser = {
      firstname: "Jane",
      lastname: "Doe",
      email: "jane.doe@example.com",
      password: "password123",
      phone: "0987654321",
      birthday: new Date("1990-01-01"),
    };

    await prisma.user.create({
      data: existingUser,
    });
    await assert.rejects(
      async () => {
        await prisma.user.create({
          data: {
            ...existingUser,
            email: existingUser.email,
          },
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err: any) => {
        return Boolean(
          err && (err.code === "P2002" || err.meta?.target?.includes("email"))
        );
      }
    );
  });
  it("should create a verification token for the new user", async () => {
    const newUser = {
      firstname: "Alice",
      lastname: "Smith",
      email: "alice.smith@example.com",
      password: "password123",
      phone: "1234567890",
      birthday: new Date("1990-01-01"),
    };

    const response = await prisma.user.create({
      data: newUser,
    });

    await prisma.token.create({
      data: {
        token: "some-unique-token",
        type: "verification_email",
        user_id: response.id,
        expired_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    const token = await prisma.token.findFirst({
      where: {
        user_id: response.id,
        type: "verification_email",
      },
    });

    assert.ok(token);
    assert.strictEqual(token?.user_id, response.id);
    assert.strictEqual(token?.type, "verification_email");
  });
  it("should hash the user's password", async () => {
    const newUser = {
      firstname: "Bob",
      lastname: "Brown",
      email: "bob.brown@example.com",
      password: "password123",
      phone: "1234567890",
      birthday: new Date("1990-01-01"),
    };

    const SALT = parseInt(process.env.SALT_ROUNDS || "12");

    const encryptedPassword = await bcrypt.hash(newUser.password, SALT);

    const response = await prisma.user.create({
      data: {
        ...newUser,
        password: encryptedPassword,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: response.id,
      },
    });

    assert.ok(user);
    assert.notStrictEqual(user?.password, newUser.password);
    const isHashed = await bcrypt.compare(newUser.password, user!.password);
    assert.ok(isHashed);
  });
});

// --------------------  Login Test  ------------------------
describe("Auth Controller - Login", () => {
  beforeEach(async () => {
    await prisma.token.deleteMany();
    await prisma.user.deleteMany();

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

    const email = "test.user@example.com";
    const password = "Password123!!";

    const SALT = parseInt(process.env.SALT_ROUNDS || "12");
    const hashedPassword = await bcrypt.hash(password, SALT);

    await prisma.user.create({
      data: {
        firstname: "Test",
        lastname: "User",
        email: email,
        password: hashedPassword,
        phone: "1234567890",
        birthday: new Date("1990-01-01"),
        is_active: true,
        role_id: 2,
      },
    });
  });
  it("should login a user with correct credentials", async () => {
    const email = "test.user@example.com";
    const password = "Password123!!";

    const response = await fetch("http://localhost:7357/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    assert.strictEqual(response.status, 200);
    assert.ok(response?.headers?.get("set-cookie"));
    assert.ok(response?.headers?.get("set-cookie")?.includes("accessToken"));
    assert.ok(response?.headers?.get("set-cookie")?.includes("refreshToken"));
  });
});
