import assert from "node:assert";
import { prisma } from "../models/index.js";
import { describe, it } from "node:test";

describe.only("[GET] /api/users", () => {
  it("should return a list of users", async () => {
    // Arrange

    const databaseUsers = await prisma.user.createManyAndReturn({
      data: [
        {
          id: 116,
          firstname: "Arjun",
          lastname: "Blick",
          email: "dan.torphy@hotmail.com",
          password: "password123-T",
          is_active: false,
          phone: "1-674-649-0759 x96741",
          birthday: "1975-04-15T00:00:00.000Z",
          last_login: null,
        },
        {
          id: 123,
          firstname: "Elena",
          lastname: "Fadel",
          email: "margaret.labadie@hotmail.com",
          password: "password123-T",
          is_active: true,
          phone: "351.738.8202 x67037",
          birthday: "2002-04-12T00:00:00.000Z",
          last_login: "2025-09-17T19:08:53.245Z",
        },
      ],
    });
    // Act
    const response = await fetch("http://localhost:7357/api/users");
    const responseUsers = await response.json();

    // Assert
    assert.ok(true);
    assert.strictEqual(response.status, 200);
  });
});
