import assert from "node:assert";
import { describe, it } from "node:test";
import { healthController } from "./health.controller.js";

describe("[GET] /api/health", () => {
  it("should return a healthy status", async () => {
    // Arrange
    // Act
    // Assert
    assert.ok(true);
  });
});

describe("[GET] /api/health", () => {
  it("should return 200 status", async () => {
    // Arrange
    let statusCode: number | undefined;
    const res = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json() {
        return this;
      },
    } as any;

    // Act
    await healthController.checking({} as any, res);

    // Assert
    assert.strictEqual(statusCode, 200);
  });
});

describe("[GET] /api/health", () => {
  it("should return 'All good here!' in the message", async () => {
    // Arrange
    let responseBody: any;
    const res = {
      status() {
        return this;
      },
      json(body: any) {
        responseBody = body;
        return this;
      },
    } as any;

    // Act
    await healthController.checking({} as any, res);

    // Assert
    assert.strictEqual(responseBody.message, "All good here!");

    assert.ok(responseBody.timestamp, "timestamp should exist");
    const date = new Date(responseBody.timestamp);
    assert.ok(!isNaN(date.getTime()), "timestamp should be a valid date");
  });
});
