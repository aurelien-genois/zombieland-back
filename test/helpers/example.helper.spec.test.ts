import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  authedRequester,
  buildAuthedRequester,
  buildFakeUser,
  buildFakeMember,
  unauthenticatedRequester,
} from "./api.helper.js";

// Helper pour ajouter des query params à l'URL
function buildUrlWithParams(endpoint: string, params?: Record<string, any>) {
  if (!params) return endpoint;
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) usp.append(key, String(value));
  }
  return `${endpoint}?${usp.toString()}`;
}

describe.only("Users Controller", () => {
  it("should get all users with admin token", async () => {
    const response = await authedRequester.get("/users");
    const data = await response.json();

    assert.strictEqual(response.status, 200);
    assert.ok("data" in data);
    assert.ok(Array.isArray(data.data));
  });

  it("should get all users with custom admin", async () => {
    const customAdmin = buildFakeUser({
      firstname: "Custom",
      lastname: "Admin",
    });
    const adminRequester = buildAuthedRequester(customAdmin);

    const response = await adminRequester.get("/users");
    const data = await response.json();

    assert.strictEqual(response.status, 200);
    assert.ok("data" in data);
  });

  it("should reject access without token", async () => {
    const response = await unauthenticatedRequester.get("/users");
    assert.strictEqual(response.status, 401);
  });

  it("should reject access with member role", async () => {
    const member = buildFakeMember();
    const memberRequester = buildAuthedRequester(member);

    const response = await memberRequester.get("/users");
    assert.strictEqual(response.status, 403);
  });

  it("should filter users by query params", async () => {
    const url = buildUrlWithParams("/users", {
      page: 1,
      limit: 10,
      firstname: "John",
    });
    const response = await authedRequester.get(url);
    const data = await response.json();

    assert.strictEqual(response.status, 200);
    assert.ok("meta" in data);
  });
});
