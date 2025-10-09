import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { prisma } from "../models/index.js";
import { unauthenticatedRequester, authedRequester } from "../../test/helpers/api.helper.js";

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

  it("Should get one category with details as authenticated user", async () => {
    // Arrange

    // Act
    const response = await authedRequester.get("/categories/1");
    const data = await response.json();

    // Assert
    assert.strictEqual(response.status, 200);
    assert.strictEqual(data.name, 'Spectacle');
  });

  it("Should return a 403 error if unauthenticated", async () => {
    // Arrange

    // Act
    const response = await unauthenticatedRequester.get("/categories/1");

    // Assert
    assert.ok(response.status === 401 || response.status === 403)
  });

  it("Should create one category with correct fields", async () => {
    // Arrange

    // Act
    const res = await authedRequester.post("/categories", {
      body : JSON.stringify({
          "name":"Librairie",
          "color":"#FF22FF"
      })
    })
  const response = await authedRequester.get("/categories/3");
  const data = await response.json();

    // Assert
    assert.strictEqual(res.status, 201);
    assert.strictEqual(data.name, "Librairie");
    assert.strictEqual(data.color, "#FF22FF");
  });

  it("Should update one category by id and returns updated fields", async () => {
    // Arrange

    // Act
    const res = await authedRequester.patch("/categories/2", {
      body : JSON.stringify({
          "name":"Theater",
          "color":"#00BBFF"
      })
    })
  const data = await res.json();

    // Assert
    assert.strictEqual(res.status, 200);
    assert.equal(data.id, "2");
    assert.strictEqual(data.name, "Theater");
    assert.strictEqual(data.color, "#00BBFF");
  });

  it("Should delete one category by id", async () => {
    // Arrange
  const res = await authedRequester.delete("/categories/2")

  // Act
  const response = await authedRequester.get("/categories/2");

    // Assert
    assert.strictEqual(res.status, 204);
    assert.strictEqual(response.status, 404);
  });

});