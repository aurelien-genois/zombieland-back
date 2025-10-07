import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  emailValidation,
  usersSchema,
  firstnameValidation,
  lastnameValidation,
  passwordValidation,
  isActiveValidation,
  phoneValidation,
  birthdayValidation,
  tokenValidation,
} from "./users.schema.js";

// -----------------------------   Email Validation  -----------------------------

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

// -----------------------------   Login Schema  -----------------------------
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

// -----------------------------   Firstname Validation  -----------------------------
describe("Firstname Validation", () => {
  it("should accept valid first names", () => {
    assert.doesNotThrow(() => firstnameValidation.parse("John"));
    assert.doesNotThrow(() => firstnameValidation.parse("Alice"));
  });
  it("should reject first names that are too short", () => {
    assert.throws(() => firstnameValidation.parse("J"));
  });
  it("should reject first names with invalid characters", () => {
    assert.throws(() => firstnameValidation.parse("John123"));
    assert.throws(() => firstnameValidation.parse("Alice!@#"));
  });
  it("should reject non-string values", () => {
    assert.throws(() => firstnameValidation.parse(null));
    assert.throws(() => firstnameValidation.parse(123));
  });
});

// -----------------------------   Lastname Validation  -----------------------------
describe("Lastname Validation", () => {
  it("should accept valid first names", () => {
    assert.doesNotThrow(() => lastnameValidation.parse("Legrand"));
    assert.doesNotThrow(() => lastnameValidation.parse("Smith"));
  });
  it("should reject lastname that are too short", () => {
    assert.throws(() => lastnameValidation.parse(""));
  });
  it("should reject first names with invalid characters", () => {
    assert.throws(() => lastnameValidation.parse("Legrand123"));
    assert.throws(() => lastnameValidation.parse("Smith!@#"));
  });
  it("should reject non-string values", () => {
    assert.throws(() => lastnameValidation.parse(null));
    assert.throws(() => lastnameValidation.parse(123));
  });
});

// -----------------------------   Password Validation  -----------------------------
describe("Password Validation", () => {
  it("should accept valid password", () => {
    assert.doesNotThrow(() => passwordValidation.parse("123456789aA!"));
    assert.doesNotThrow(() => passwordValidation.parse("Test-1Passwo"));
  });
  it("should reject password that are too short", () => {
    assert.throws(() => passwordValidation.parse(""));
  });
  it("should reject password with invalid characters", () => {
    assert.throws(() => passwordValidation.parse("123456789"));
    assert.throws(() => passwordValidation.parse("lowercase"));
  });
  it("should reject non-string values", () => {
    assert.throws(() => passwordValidation.parse(null));
    assert.throws(() => passwordValidation.parse(123));
  });
});

// -----------------------------   Is Active Validation  -----------------------------
describe("Is Active Validation", () => {
  it("should accept boolean values", () => {
    assert.doesNotThrow(() => isActiveValidation.parse(true));
    assert.doesNotThrow(() => isActiveValidation.parse(false));
  });
  it("should reject non-boolean values", () => {
    assert.throws(() => isActiveValidation.parse("true"));
    assert.throws(() => isActiveValidation.parse(1));
    assert.throws(() => isActiveValidation.parse(null));
  });
});

// -----------------------------   Phone Validation  -----------------------------
describe("Phone Validation", () => {
  it("should accept valid phone numbers", () => {
    assert.doesNotThrow(() => phoneValidation.parse("1234567890"));
    assert.doesNotThrow(() => phoneValidation.parse("+1234567890"));
    assert.doesNotThrow(() => phoneValidation.parse("123-456-7890"));
    assert.doesNotThrow(() => phoneValidation.parse("(123) 456-7890"));
  });
  it("should reject phone numbers that are too short", () => {
    assert.throws(() => phoneValidation.parse("123"));
  });
  it("should reject phone numbers with invalid characters", () => {
    assert.throws(() => phoneValidation.parse("1234567890abc"));
    assert.throws(() => phoneValidation.parse("12@34"));
  });
  it("should reject non-string values", () => {
    assert.throws(() => phoneValidation.parse(null));
    assert.throws(() => phoneValidation.parse(123));
  });
});

// -----------------------------   Birthday Validation  -----------------------------
describe("Birthday Validation", () => {
  it("should accept valid date strings", () => {
    assert.doesNotThrow(() => birthdayValidation.parse("2000-01-01"));
    assert.doesNotThrow(() => birthdayValidation.parse("1995-12-31"));
  });
  it("should reject non-date values", () => {
    assert.throws(() => birthdayValidation.parse(null));
    assert.throws(() => birthdayValidation.parse(12345));
    assert.throws(() => birthdayValidation.parse({}));
  });
  it("should reject invalid date strings", () => {
    assert.throws(() => birthdayValidation.parse("invalid-date"));
  });
});

// -----------------------------   Last Login Validation  -----------------------------
describe("Last Login Validation", () => {
  it("should accept valid date strings", () => {
    assert.doesNotThrow(() =>
      birthdayValidation.parse("2025-10-01 12:30:11.551")
    );
    assert.doesNotThrow(() => birthdayValidation.parse("2022-12-31T23:59:59Z"));
  });
  it("should reject non-date values", () => {
    assert.throws(() => birthdayValidation.parse(null));
    assert.throws(() => birthdayValidation.parse(12345));
    assert.throws(() => birthdayValidation.parse({}));
  });
  it("should reject invalid date strings", () => {
    assert.throws(() => birthdayValidation.parse("invalid-date"));
  });
});

// --------------------  Token Validation  ------------------------
describe.only("Token Validation", () => {
  it("should accept valid UUID v4", () => {
    assert.doesNotThrow(() =>
      tokenValidation.parse("23d3ff0c-b796-4eed-b414-f96744af4104")
    );
  });

  it("should reject invalid UUIDs", () => {
    assert.throws(() => tokenValidation.parse("invalid-uuid"));
    assert.throws(() => tokenValidation.parse("1234"));
  });

  it("should reject non-string values", () => {
    assert.throws(() => tokenValidation.parse(null));
    assert.throws(() => tokenValidation.parse(123));
    assert.throws(() => tokenValidation.parse({}));
  });
});
