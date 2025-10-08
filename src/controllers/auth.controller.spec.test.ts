import assert from "node:assert";
import { prisma } from "../models/index.js";
import { before, describe, it } from "node:test";

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
});
