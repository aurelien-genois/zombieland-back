import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { emailValidation, usersSchema } from "./users.schema.js";

describe("Email Validation", () => {
  it("should accept valid emails", () => {
    assert.doesNotThrow(() => emailValidation.parse("test@example.com"));
    assert.doesNotThrow(() => emailValidation.parse("user@domain.org"));
  });

  it("should normalize emails (trim and lowercase)", () => {
    const result = emailValidation.parse("  JOHN@EXAMPLE.COM  ");
    assert.strictEqual(result, "john@example.com");
  });

  it("should reject invalid emails", () => {
    assert.throws(() => emailValidation.parse("invalid-email"));
    assert.throws(() => emailValidation.parse("user@"));
    assert.throws(() => emailValidation.parse(""));
  });

  it("should reject non-string values", () => {
    assert.throws(() => emailValidation.parse(null));
    assert.throws(() => emailValidation.parse(123));
  });
});

describe("Login Schema", () => {
  it("should validate correct login data", () => {
    const loginData = {
      email: "test@example.com",
      password: "securePassword-123",
    };

    assert.doesNotThrow(() => usersSchema.login.parse(loginData));
  });

  it("should reject login data with invalid email", () => {
    const loginData = {
      email: "invalid-email",
      password: "securePassword1-23",
    };

    assert.throws(() => usersSchema.login.parse(loginData));
  });
});
