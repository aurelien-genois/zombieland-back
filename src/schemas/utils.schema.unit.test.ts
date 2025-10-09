import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseIdValidation } from "./utils.schema.js";

// -----------------------------   Parse Id Validation  -----------------------------
describe.only("Parse Id Validation", () => {
  it("should accept valid positive integer strings", () => {
    assert.doesNotThrow(() => parseIdValidation.parse("123"));
    assert.doesNotThrow(() => parseIdValidation.parse(456));
  });
  it("should reject non-numeric strings", () => {
    assert.throws(
      () => parseIdValidation.parse("abc"),
      /Parameter is required/
    );
    assert.throws(
      () => parseIdValidation.parse("12.34"),
      /Parameter should be a positif number!/
    );
    assert.throws(
      () => parseIdValidation.parse("-56"),
      /Parameter must be a positive integer/
    );
  });
});
