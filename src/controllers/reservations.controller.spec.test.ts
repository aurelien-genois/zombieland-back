import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import bcrypt from "bcrypt";
import { prisma } from "../models/index.js";
import { generateAuthenticationTokens } from "../lib/token.js";
import { apiBaseUrl} from '../../test/helpers/api.helper.js'

const BASE_URL = apiBaseUrl;

function futureDate(days = 7) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

async function jsonFetch(
  url: string,
  init: RequestInit = {}
): Promise<{ status: number; data }> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  let payload = null;
  try { payload = await res.json(); } catch { /* empty */ }
  return { status: res.status, data: payload };
}

describe("Reservations Controller", () => {
  let adminToken: string;
  let memberToken: string;

  let adminUserId: number;
  let memberUserId: number;

  let productAId: number;
  let productBId: number;

  beforeEach(async () => {
    await prisma.role.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, name: "admin" },
    });
    await prisma.role.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, name: "member" },
    });


    const adminPwd = await bcrypt.hash("adminpassword", 10);
    const memberPwd = await bcrypt.hash("memberpassword", 10);

    const admin = await prisma.user.create({
      data: {
        firstname: "Admin",
        lastname: "Reservations",
        email: `admin.resa+${Date.now()}@test.com`,
        password: adminPwd,
        role_id: 1,
        is_active: true,
        phone: "0102030405",
        birthday: new Date("1990-01-01"),
      },
      include: { role: true },
    });
    const member = await prisma.user.create({
      data: {
        firstname: "Member",
        lastname: "Reservations",
        email: `member.resa+${Date.now()}@test.com`,
        password: memberPwd,
        role_id: 2,
        is_active: true,
        phone: "0607080910",
        birthday: new Date("1992-02-02"),
      },
      include: { role: true },
    });

    adminUserId = admin.id;
    memberUserId = member.id;

    // Tokens
    adminToken = generateAuthenticationTokens(admin).accessToken.token;
    memberToken = generateAuthenticationTokens(member).accessToken.token;


    const pA = await prisma.product.create({
      data: { name: "Billet Adulte", price: 20, status: "published" },
    });
    const pB = await prisma.product.create({
      data: { name: "Billet Enfant", price: 10, status: "published" },
    });

    productAId = pA.id;
    productBId = pB.id;
  });

  it("admin: should create an order for a target user", async () => {
    const body = {
      user_id: memberUserId,
      visit_date: futureDate(10),
      vat: 5.5,
      order_lines: [{ product_id: productAId, quantity: 2 }],
    };

    const { status, data } = await jsonFetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify(body),
    });

    assert.strictEqual(status, 201, `Expected 201, got ${status} | ${JSON.stringify(data)}`);
    assert.strictEqual(data.user_id, memberUserId);
    assert.strictEqual(data.status, "pending");
    assert.ok(Array.isArray(data.order_lines) && data.order_lines.length === 1);
  });

  it("member: should create an order for himself even if user_id provided", async () => {
    const body = {
      user_id: adminUserId,
      visit_date: futureDate(5),
      vat: 5.5,
      order_lines: [{ product_id: productBId, quantity: 1 }],
    };

    const { status, data } = await jsonFetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${memberToken}` },
      body: JSON.stringify(body),
    });

    assert.strictEqual(status, 201, `Expected 201, got ${status} | ${JSON.stringify(data)}`);
    assert.strictEqual(data.user_id, memberUserId);
    assert.strictEqual(data.status, "pending");
  });

  it("admin: creating order with non existing user_id should return 404", async () => {
    const body = {
      user_id: 999999,
      visit_date: futureDate(7),
      vat: 5.5,
      order_lines: [{ product_id: productAId, quantity: 1 }],
    };

    const { status, data } = await jsonFetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify(body),
    });

    assert.strictEqual(status, 404, `Expected 404, got ${status} | ${JSON.stringify(data)}`);
    assert.strictEqual(data?.error, "User not found");
  });

  it("admin: should list orders with pagination", async () => {
    await prisma.order.create({
      data: {
        status: "pending",
        visit_date: new Date(Date.now() + 3 * 86400000),
        vat: 5.5,
        user_id: memberUserId,
        ticket_code: `TEST-${Date.now()}`,
        qr_code: Math.random().toString(36).substring(2, 42),
        order_lines: {
          create: [{ product_id: productAId, quantity: 1, unit_price: 20 }],
        },
      },
    });

    const url = `${BASE_URL}/orders?limit=10&page=1`;
    const { status, data } = await jsonFetch(url, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.strictEqual(status, 200, `Got ${status} | ${JSON.stringify(data)}`);
    assert(Array.isArray(data.data), "data must be an array");
    assert(typeof data.meta?.totalCount === "number", "meta must contain totalCount");
  });

  it("admin: should list orders for a specific user", async () => {
    await prisma.order.create({
      data: {
        status: "pending",
        visit_date: new Date(Date.now() + 4 * 86400000),
        vat: 5.5,
        user_id: memberUserId,
        ticket_code: `TEST-${Date.now()}`,
        qr_code: Math.random().toString(36).substring(2, 42),
        order_lines: {
          create: [{ product_id: productBId, quantity: 2, unit_price: 10 }],
        },
      },
    });

    const url = `${BASE_URL}/orders/user/${memberUserId}?limit=10&page=1`;
    const { status, data } = await jsonFetch(url, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.strictEqual(status, 200, `Got ${status} | ${JSON.stringify(data)}`);
    assert(Array.isArray(data.data));
    assert(typeof data.meta?.totalCount === "number");
  });

  it("admin: should get one order by id", async () => {
    const order = await prisma.order.create({
      data: {
        status: "pending",
        visit_date: new Date(Date.now() + 5 * 86400000),
        vat: 5.5,
        user_id: memberUserId,
        ticket_code: `TEST-${Date.now()}`,
        qr_code: Math.random().toString(36).substring(2, 42),
        order_lines: {
          create: [{ product_id: productAId, quantity: 1, unit_price: 20 }],
        },
      },
    });

    const { status, data } = await jsonFetch(`${BASE_URL}/orders/${order.id}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert.strictEqual(status, 200, `Got ${status} | ${JSON.stringify(data)}`);
    assert.strictEqual(data.id, order.id);
    assert.ok(Array.isArray(data.order_lines));
  });

  it("member: should add a line on his pending order", async () => {
    const order = await prisma.order.create({
      data: {
        status: "pending",
        visit_date: new Date(Date.now() + 6 * 86400000),
        vat: 5.5,
        user_id: memberUserId,
        ticket_code: `TEST-${Date.now()}`,
        qr_code: Math.random().toString(36).substring(2, 42),
        order_lines: {
          create: [{ product_id: productAId, quantity: 1, unit_price: 20 }],
        },
      },
    });

    const body = { product_id: productAId, quantity: 1 };
    const { status, data } = await jsonFetch(`${BASE_URL}/orders/${order.id}/lines`, {
      method: "POST",
      headers: { Authorization: `Bearer ${memberToken}` },
      body: JSON.stringify(body),
    });

    assert.strictEqual(status, 201, `Expected 201 created, got ${status} | ${JSON.stringify(data)}`);
    assert.strictEqual(data.order_id, order.id);
    assert.strictEqual(data.product.id, productAId);
  });

  it("admin: should update order status from pending to confirmed", async () => {
    const order = await prisma.order.create({
      data: {
        status: "pending",
        visit_date: new Date(Date.now() + 10 * 86400000),
        vat: 5.5,
        user_id: memberUserId,
        ticket_code: `TEST-${Date.now()}`,
        qr_code: Math.random().toString(36).substring(2, 42),
        order_lines: {
          create: [{ product_id: productAId, quantity: 1, unit_price: 20 }],
        },
      },
    });

    const { status, data } = await jsonFetch(`${BASE_URL}/orders/${order.id}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: "confirmed" }),
    });

    assert.strictEqual(status, 200, `Got ${status} | ${JSON.stringify(data)}`);
    assert.strictEqual(data.status, "confirmed");
  });
});
