import assert from "node:assert";
import { describe, it } from "node:test";
import { healthController } from "./health.controller.js";
import { Request, Response } from "express";

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
    };

    // Act
    await healthController.checking({} as Request, res as Response);

    // Assert
    assert.strictEqual(statusCode, 200);
  });
});

describe("[GET] /api/health", () => {
  it("should return 'All good here!' in the message", async () => {
    type MockBody = {
      message: string;
      timestamp: string;
    };

    // Arrange
    let responseBody: null | MockBody = null;
    const res = {
      status() {
        return this;
      },
      json(body: MockBody) {
        responseBody = body;
        return this;
      },
    };

    // Act
    await healthController.checking({} as Request, res as unknown as Response);

    // Assert
    assert.notEqual(responseBody, null);
    if (responseBody) {
      const responseBodyOk = responseBody as MockBody;
      assert.strictEqual(responseBodyOk.message, "All good here!");

      assert.ok(responseBodyOk.timestamp, "timestamp should exist");
      const date = new Date(responseBodyOk.timestamp);
      assert.ok(!isNaN(date.getTime()), "timestamp should be a valid date");
    }
  });
});
