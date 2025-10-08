import assert from "node:assert";
import { prisma } from "../models/index.js";
import { before, describe, it } from "node:test";
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
  it.only("should hash the user's password", async () => {
    const newUser = {
      firstname: "Bob",
      lastname: "Brown",
      email: "bob.brown@example.com",
      password: "password123",
      phone: "1234567890",
      birthday: new Date("1990-01-01"),
    };

    const SALT = parseInt(process.env.SALT_ROUNDS || "8");

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
