import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { orderSchema, orderLineSchema } from "./reservation.schema.js";

function futureISO(days = 7) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

describe("Order Schema - create", () => {
  it("should accept a valid payload (with lines) and keep VAT default if omitted", () => {
    const input = {
      visit_date: futureISO(10),
      order_lines: [{ product_id: 1, quantity: 2 }],
      payment_method: "card",
      user_id: 123,
    };

    const parsed = orderSchema.create.parse(input);
    assert.equal(typeof parsed.visit_date, "object"); 
    assert.equal(parsed.vat, 5.5);
    assert.equal(parsed.payment_method, "card");
    assert.equal(parsed.order_lines?.length, 1);
    assert.equal(parsed.user_id, 123);
  });

  it("should reject visit_date in the past", () => {
    const input = {
      visit_date: new Date(Date.now() - 86400000).toISOString(),
      vat: 5.5,
      order_lines: [{ product_id: 1, quantity: 1 }],
    };
    assert.throws(() => orderSchema.create.parse(input));
  });

  it("should enforce VAT range and precision", () => {
    // ok
    assert.doesNotThrow(() =>
      orderSchema.create.parse({
        visit_date: futureISO(1),
        vat: 20,
        order_lines: [{ product_id: 1, quantity: 1 }],
      })
    );

    // > 100 -> ko
    assert.throws(() =>
      orderSchema.create.parse({
        visit_date: futureISO(1),
        vat: 101,
        order_lines: [{ product_id: 1, quantity: 1 }],
      })
    );

    // négatif -> ko
    assert.throws(() =>
      orderSchema.create.parse({
        visit_date: futureISO(1),
        vat: -1,
        order_lines: [{ product_id: 1, quantity: 1 }],
      })
    );
  });

  it("should require at least one order line when provided", () => {
    const ok = {
      visit_date: futureISO(1),
      vat: 5.5,
      order_lines: [{ product_id: 1, quantity: 1 }],
    };
    assert.doesNotThrow(() => orderSchema.create.parse(ok));

    const ko = {
      visit_date: futureISO(1),
      vat: 5.5,
      order_lines: [],
    };
    assert.throws(() => orderSchema.create.parse(ko));
  });

  it("should accept create without order_lines (optional)", () => {
    const input = { visit_date: futureISO(2), vat: 5.5 };
    assert.doesNotThrow(() => orderSchema.create.parse(input));
  });

  it("should validate payment_method minimal length when provided", () => {
    const ok = {
      visit_date: futureISO(1),
      vat: 5.5,
      payment_method: "cb",
    };
    assert.doesNotThrow(() => orderSchema.create.parse(ok));

    const ko = {
      visit_date: futureISO(1),
      vat: 5.5,
      payment_method: "a",
    };
    assert.throws(() => orderSchema.create.parse(ko));
  });
});

describe("Order Schema - updateStatus", () => {
  it("should accept allowed statuses", () => {
    for (const s of ["pending", "confirmed", "canceled", "refund"] as const) {
      assert.doesNotThrow(() => orderSchema.updateStatus.parse({ status: s }));
    }
  });

  it("should reject unknown status", () => {
    assert.throws(() => orderSchema.updateStatus.parse({ status: "weird" }));
  });
});

describe("Order Schema - update", () => {
  it("should accept partial updates", () => {
    assert.doesNotThrow(() =>
      orderSchema.update.parse({ payment_method: "sepa" })
    );
    assert.doesNotThrow(() =>
      orderSchema.update.parse({ visit_date: futureISO(3) })
    );
    assert.doesNotThrow(() => orderSchema.update.parse({ vat: 7.2 }));
    assert.doesNotThrow(() => orderSchema.update.parse({ status: "canceled" }));
  });

  it("should reject invalid VAT / date / status", () => {
    assert.throws(() => orderSchema.update.parse({ vat: 200 }));
    assert.throws(() =>
      orderSchema.update.parse({ visit_date: new Date(Date.now() - 1000).toISOString() })
    );
    assert.throws(() => orderSchema.update.parse({ status: "nope" }));
  });
});

describe("Order Schema - filter", () => {
  it("should accept filters and normalize defaults", () => {
    const parsed = orderSchema.filter.parse({
      page: "1",
      limit: "10",
      order: "order_date:asc",
      search: "John_Doe-123",
    });
    assert.equal(parsed.page, 1);
    assert.equal(parsed.limit, 10);
    assert.equal(parsed.order, "order_date:asc");
    assert.equal(parsed.search, "John_Doe-123");
  });

  it("should reject invalid search characters", () => {
    assert.throws(() =>
      orderSchema.filter.parse({ search: "<script>" })
    );
  });
});

describe("Order Schema - userOrders", () => {
  it("should accept valid user orders filter", () => {
    const parsed = orderSchema.userOrders.parse({
      user_id: 42,
      page: "2",
      limit: "5",
      order: "visit_date:desc",
      status: "pending",
    });
    assert.equal(parsed.user_id, 42);
    assert.equal(parsed.page, 2);
    assert.equal(parsed.limit, 5);
    assert.equal(parsed.order, "visit_date:desc");
    assert.equal(parsed.status, "pending");
  });

  it("should reject invalid status", () => {
    assert.throws(() => orderSchema.userOrders.parse({ user_id: 1, status: "weird" }));
  });
});

describe("OrderLine Schema", () => {
  it("should validate create line", () => {
    assert.doesNotThrow(() =>
      orderLineSchema.create.parse({ product_id: 10, quantity: 2 })
    );
  });

  it("should reject invalid quantity (non positive / > 20 / non integer)", () => {
    assert.throws(() =>
      orderLineSchema.create.parse({ product_id: 10, quantity: 0 })
    );
    assert.throws(() =>
      orderLineSchema.create.parse({ product_id: 10, quantity: 21 })
    );
    assert.throws(() =>
      orderLineSchema.create.parse({ product_id: 10, quantity: 1.5 })
    );
  });

  it("should validate update line (partial & optional)", () => {
    assert.doesNotThrow(() =>
      orderLineSchema.update.parse({ quantity: 5 })
    );
    assert.doesNotThrow(() =>
      orderLineSchema.update.parse({})
    );
  });
});
