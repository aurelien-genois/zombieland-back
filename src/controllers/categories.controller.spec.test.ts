import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { prisma } from "../models/index.js";

import { unauthenticatedRequester } from "../../test/helpers/api.helper.js";

//
describe("[GET] /api/categories", () => {
  beforeEach(async () => {
    await prisma.category.createMany({
      data: [
        {
          name: "Spectacle",
          color: "#FF0000",
        },
        {
          name: "Manège",
          color: "#0000FF",
        },
      ],
    });
  });

  // ! global-setup.ts "" execute "await truncateTables();" before each test
  // ... and after before() above (which is before all tests), so the data are removed

  it("Should get all categories", async () => {
    // Arrange

    // Act
    const response = await unauthenticatedRequester.get("/categories");
    const data = await response.json();

    // Assert
    assert.strictEqual(response.status, 200);

    assert.strictEqual(data.items.length, 2);
  });
});

// [GET] /api/categories/:id
// [POST] /api/categories
// [PATCH] /api/categories/:id
// [DELETE] /api/categories/:id
