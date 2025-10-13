import type { Request, Response } from "express";
import { prisma } from "../models/index.js";
import { Prisma, OrderStatus } from "@prisma/client";
import { orderLineSchema, orderSchema } from "../schemas/reservation.schema.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../lib/errors.js";
import { parseIdValidation } from "../schemas/utils.schema.js";

import Stripe from "stripe";
import { config } from "../../server.config.js";
import type { Options } from "../@types/express.js";

type Meta = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const orderInclude = {
  user: {
    select: { id: true, firstname: true, lastname: true, email: true },
  },
  order_lines: {
    include: { product: true },
  },
} as const;
type OrderWithLinesAndUser = Prisma.OrderGetPayload<{
  include: typeof orderInclude;
}>;

function generateTicketCode() {
  return `ZMB-${new Date().getFullYear()}-${Date.now()}-${Math.floor(
    Math.random() * 1e6
  )}`.toUpperCase();
}

function generateRandomString() {
  function strRandom(o: Options): string {
    const b = 'abcdefghijklmnopqrstuvwxyz';
    let a = 10,     
        c = '',
        d = 0,
        e = ''+b;
    if (o) {
      if (o.startsWithLowerCase) {
        c = b[Math.floor(Math.random() * b.length)];
        d = 1;
      }
      if (o.length) {
        a = o.length;
      }
      if (o.includeUpperCase) {
        e += b.toUpperCase();
      }
      if (o.includeNumbers) {
        e += '1234567890';
      }
    }
    for (; d < a; d++) {
      c += e[Math.floor(Math.random() * e.length)];
    }
    return c;
  }

  const options = {
    includeUpperCase: true,
    includeNumbers: true,
    length: 40,
  };

  return strRandom(options);
}

function amountsFromLines(
  lines: Array<{ unit_price: number; quantity: number }>,
  vat: Prisma.Decimal | number
) {
  const subtotalD = lines.reduce(
    (sum, line) =>
      sum.plus(new Prisma.Decimal(line.unit_price).mul(line.quantity)),
    new Prisma.Decimal(0)
  );
  const vatD = subtotalD.mul(vat).div(100);
  const totalD = subtotalD.plus(vatD);
  const subtotal = +subtotalD.toDecimalPlaces(2).toString();
  const vat_amount = +vatD.toDecimalPlaces(2).toString();
  const total = +totalD.toDecimalPlaces(2).toString();
  return { subtotal, vat_amount, total };
}

const stripe = new Stripe(config.server.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

const reservationsController = {
  // GET All reservations + Pagination + Queries
  async getAllOrders(req: Request, res: Response) {
    const userRole = req.userRole as string | undefined;
    if (userRole !== "admin") {
      throw new UnauthorizedError("Unauthorized");
    }
    const {
      status,
      user_id,
      visit_date_from,
      visit_date_to,
      order_date_from,
      order_date_to,
      payment_method,
      limit,
      page,
      order,
      search,
    } = await orderSchema.filter.parseAsync(req.query);
    const whereClause = {
      ...(status && { status }),
      ...(user_id && { user_id }),
      ...((visit_date_from || visit_date_to) && {
        visit_date: {
          ...(visit_date_from && { gte: visit_date_from }),
          ...(visit_date_to && { lte: visit_date_to }),
        },
      }),
      ...((order_date_from || order_date_to) && {
        order_date: {
          ...(order_date_from && { gte: order_date_from }),
          ...(order_date_to && { lte: order_date_to }),
        },
      }),

      ...(payment_method && { payment_method }),

      ...(search && {
        OR: [
          {
            payment_method: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            user: {
              email: { contains: search, mode: Prisma.QueryMode.insensitive },
            },
          },
          {
            user: {
              firstname: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
          {
            user: {
              lastname: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        ],
      }),
    };
    const orderBy: Prisma.OrderOrderByWithRelationInput[] = [
      order === "order_date:asc"
        ? { order_date: "asc" }
        : order === "order_date:desc"
        ? { order_date: "desc" }
        : order === "visit_date:asc"
        ? { visit_date: "asc" }
        : order === "visit_date:desc"
        ? { visit_date: "desc" }
        : order === "status:asc"
        ? { status: "asc" }
        : order === "status:desc"
        ? { status: "desc" }
        : { order_date: "desc" },
    ];

    const totalCount = await prisma.order.count({
      where: whereClause,
    });
    const orders = await prisma.order.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        order_lines: {
          include: {
            product: true,
          },
        },
      },
    });
    const data = orders.map((order: OrderWithLinesAndUser) => {
      // 👈
      const { subtotal, vat_amount, total } = amountsFromLines(
        order.order_lines.map((line) => ({
          unit_price: line.unit_price,
          quantity: line.quantity,
        })),
        order.vat
      );
      return { ...order, subtotal, vat_amount, total };
    });
    const meta: Meta = {
      page,
      limit,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
      hasPrev: page > 1,
      hasNext: page * limit < totalCount,
    };
    res.status(200).json({ data, meta });
  },

  async getUserOrders(req: Request, res: Response) {
    const targetUserId = await parseIdValidation.parseAsync(req.params.user_id);
    const userRole = req.userRole as string | undefined;
    const userId = req.userId;

    if (userRole !== "admin" && targetUserId !== userId) {
      throw new UnauthorizedError(
        "Unauthorized - You can only view your own orders"
      );
    }

    const { status, limit, page, order } =
      await orderSchema.userOrders.parseAsync({
        ...req.query,
        user_id: targetUserId,
      });

    const orderBy: Prisma.OrderOrderByWithRelationInput[] = [
      order === "order_date:asc"
        ? { order_date: "asc" }
        : order === "order_date:desc"
        ? { order_date: "desc" }
        : order === "visit_date:asc"
        ? { visit_date: "asc" }
        : order === "visit_date:desc"
        ? { visit_date: "desc" }
        : order === "status:asc"
        ? { status: "asc" }
        : order === "status:desc"
        ? { status: "desc" }
        : { order_date: "desc" },
    ];

    const totalCount = await prisma.order.count({
      where: {
        user_id: targetUserId,
        ...(status && { status }),
      },
    });
    const orders = await prisma.order.findMany({
      where: {
        user_id: targetUserId,
        ...(status && { status }),
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
      include: {
        order_lines: {
          include: {
            product: true,
          },
        },
      },
    });

    const data = orders.map((order) => {
      const { subtotal, vat_amount, total } = amountsFromLines(
        order.order_lines.map((line) => ({
          unit_price: line.unit_price,
          quantity: line.quantity,
        })),
        Number(order.vat)
      );
      return { ...order, subtotal, vat_amount, total };
    });
    const meta: Meta = {
      page,
      limit,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
      hasPrev: page > 1,
      hasNext: page * limit < totalCount,
    };
    res.status(200).json({ data, meta });
  },
  async getOneOrder(req: Request, res: Response) {
    const orderId = await parseIdValidation.parseAsync(req.params.id);
    const userId = req.userId;
    const userRole = req.userRole as string | undefined;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            phone: true,
          },
        },
        order_lines: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // Un utilisateur ne peut voir que ses propres commandes, sauf admin
    if (userRole !== "admin" && order.user_id !== userId) {
      throw new UnauthorizedError(
        "Unauthorized - You can only view your own orders"
      );
    }

    const { subtotal, vat_amount, total } = amountsFromLines(
      order.order_lines.map((line) => ({
        unit_price: line.unit_price,
        quantity: line.quantity,
      })),
      Number(order.vat)
    );

    res.status(200).json({
      ...order,
      subtotal,
      vat_amount,
      total,
    });
  },

  async createOrder(req: Request, res: Response) {
    // il faut être connecté (admin ou membre)
    if (!req.userId) {
      throw new UnauthorizedError("Unauthorized - Must be logged in");
    }

    // on accepte user_id dans le body pour les admins
    const { visit_date, vat, payment_method, order_lines, user_id } =
      await orderSchema.create.parseAsync(req.body);

    // admin peut créer pour un autre user, sinon on force le user connecté
    const role = req.userRole as string | undefined;
    const targetUserId = role === "admin" && user_id ? user_id : req.userId;

    // visit_date > now
    if (new Date(visit_date) <= new Date()) {
      throw new BadRequestError("Visit date must be in the future");
    }

    // Vérifie que le user existe (sinon 404 lisible)
    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // snapshot unit_price à partir des produits
    let createLines:
      | {
          create: Array<{
            product_id: number;
            quantity: number;
            unit_price: number;
          }>;
        }
      | undefined;

    if (order_lines && order_lines.length > 0) {
      const ids = order_lines.map((l) => l.product_id);
      const products = await prisma.product.findMany({
        where: { id: { in: ids } },
      });
      if (products.length !== ids.length) {
        throw new NotFoundError("One or more products not found");
      }
      createLines = {
        create: order_lines.map((l) => {
          const p = products.find((pp) => pp.id === l.product_id)!;
          return {
            product_id: l.product_id,
            quantity: l.quantity,
            unit_price: p.price,
          };
        }),
      };
    }

    const order = await prisma.order.create({
      data: {
        status: "pending",
        visit_date,
        vat,
        user_id: targetUserId,
        ticket_code: generateTicketCode(),
        qr_code: generateRandomString(),
        ...(payment_method ? { payment_method } : {}),
        ...(createLines && { order_lines: createLines }),
      },
      include: {
        order_lines: {
          include: { product: { select: { id: true, name: true } } },
        },
        user: {
          select: { id: true, firstname: true, lastname: true, email: true },
        },
      },
    });

    const { subtotal, vat_amount, total } = amountsFromLines(
      order.order_lines.map((l) => ({
        unit_price: l.unit_price,
        quantity: l.quantity,
      })),
      Number(order.vat)
    );

    res.status(201).json({ ...order, subtotal, vat_amount, total });
  },

  async addOrderLines(req: Request, res: Response) {
    const orderId = await parseIdValidation.parseAsync(req.params.id);
    const { quantity, product_id } = await orderLineSchema.create.parseAsync(
      req.body
    );
    const userId = req.userId;
    const role = req.userRole as string | undefined;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });
    if (!order) throw new NotFoundError("Order not found");

    if (role !== "admin" && order.user_id !== userId) {
      throw new UnauthorizedError(
        "Unauthorized - You can only modify your own orders"
      );
    }
    if (order.status !== "pending") {
      throw new BadRequestError("Can only add lines to pending orders");
    }

    const product = await prisma.product.findUnique({
      where: { id: product_id },
    });
    if (!product) throw new NotFoundError("Product not found");

    const line = await prisma.orderLine.create({
      data: {
        order_id: orderId,
        product_id,
        quantity,
        // snapshot
        unit_price: product.price,
      },
      include: { product: { select: { id: true, name: true } } },
    });

    res.status(201).json(line);
  },

  async updateOrderLine(req: Request, res: Response) {
    const lineId = await parseIdValidation.parseAsync(req.params.lineId);
    const { quantity } = await orderLineSchema.update.parseAsync(req.body);

    const userId = req.userId;
    const role = req.userRole as string | undefined;

    const line = await prisma.orderLine.findUnique({
      where: { id: lineId },
      include: { order: true },
    });
    if (!line) throw new NotFoundError("Order line not found");

    if (role !== "admin" && line.order.user_id !== userId) {
      throw new UnauthorizedError(
        "Unauthorized - You can only modify your own orders"
      );
    }
    if (line.order.status !== "pending") {
      throw new BadRequestError("Can only modify lines in pending orders");
    }

    // On ne modifie que la quantité
    const updated = await prisma.orderLine.update({
      where: { id: lineId },
      data: { ...(quantity !== undefined ? { quantity } : {}) },
      include: { product: { select: { id: true, name: true } } },
    });

    res.status(200).json(updated);
  },

  async deleteOrderLine(req: Request, res: Response) {
    const lineId = await parseIdValidation.parseAsync(req.params.lineId);
    const userId = req.userId;
    const role = req.userRole as string | undefined;

    const line = await prisma.orderLine.findUnique({
      where: { id: lineId },
      include: { order: true },
    });
    if (!line) {
      throw new NotFoundError("Order line not found");
    }
    if (role !== "admin" && line.order.user_id !== userId) {
      throw new UnauthorizedError(
        "Unauthorized - You can only modify your own orders"
      );
    }
    if (line.order.status !== "pending") {
      throw new BadRequestError("Can only delete lines from pending orders");
    }

    await prisma.orderLine.delete({ where: { id: lineId } });
    res.status(204).json();
  },

  async updateOrderStatus(req: Request, res: Response) {
    const orderId = await parseIdValidation.parseAsync(req.params.id);
    const { status } = await orderSchema.updateStatus.parseAsync(req.body);
    const userId = req.userId;
    const role = req.userRole as string | undefined;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        order_lines: true,
        user: {
          select: { id: true, firstname: true, lastname: true, email: true },
        },
      },
    });
    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (role !== "admin") {
      if (order.user_id !== userId) {
        throw new UnauthorizedError("Unauthorized");
      }
      if (status !== "canceled") {
        throw new UnauthorizedError("Only cancel is allowed for a member");
      }
      if (order.status !== "pending") {
        throw new BadRequestError("You can only cancel pending orders");
      }
    }
    // add status restriction. for exemple : if pending : change for "confirmed" or "canceled" only
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.pending]: [OrderStatus.confirmed, OrderStatus.canceled],
      [OrderStatus.confirmed]: [OrderStatus.refund, OrderStatus.canceled],
      [OrderStatus.canceled]: [],
      [OrderStatus.refund]: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      throw new BadRequestError(
        `Cannot transition from ${order.status} to ${status}`
      );
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        order_lines: true,
        user: {
          select: { id: true, firstname: true, lastname: true, email: true },
        },
      },
    });

    const { subtotal, vat_amount, total } = amountsFromLines(
      updated.order_lines.map((l) => ({
        unit_price: l.unit_price,
        quantity: l.quantity,
      })),
      Number(updated.vat)
    );

    res.status(200).json({ ...updated, subtotal, vat_amount, total });
  },

  // ===========================================
  // https://www.youtube.com/watch?v=x9cGa3oMJPc
  // Help for stripe cli installation & config
  // ===========================================

  // =====================================
  // POST /api/orders/:id/checkout/stripe
  // =====================================
  async createStripeCheckoutSession(req: Request, res: Response) {
    // Authentication required
    if (!req.userId) {
      throw new UnauthorizedError("Unauthorized - Must be logged in");
    }

    const orderId = await parseIdValidation.parseAsync(req.params.id);

    // Retrieves the command with its lines + user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        order_lines: { include: { product: true } },
        user: {
          select: { id: true, firstname: true, lastname: true, email: true },
        },
      },
    });
    if (!order) throw new NotFoundError("Order not found");

    // Only the owner (or admin) can initiate payment
    const role = req.userRole as string | undefined;
    if (role !== "admin" && order.user_id !== req.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    // The order must be 'pending' to initiate payment
    if (order.status !== OrderStatus.pending) {
      throw new BadRequestError("Order must be pending to start payment");
    }

    // Line items Stripe (in CENTS)
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      order.order_lines.map((l) => ({
        price_data: {
          currency: "eur",
          product_data: { name: l.product.name },
          unit_amount: Math.round(l.unit_price * 100),
        },
        quantity: l.quantity,
      }));

    // Create the session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: order.user.email,
      metadata: {
        order_id: String(order.id),
        user_id: String(order.user_id),
      },
      success_url: `${process.env.FRONT_URL}/checkout/confirmation/${order.id}`,
      cancel_url: `${process.env.FRONT_URL}/checkout/payment/stripe?canceled=1&order_id=${order.id}`,
    });

    return res.status(200).json({ url: session.url });
  },

  // =====================================================================================
  // POST /api/orders/payment/stripe  -> webhook Stripe (IPN)
  // route to declare with express.raw({ type: "application/json" })
  // =====================================================================================
  async ipn(req: Request, res: Response) {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
      return res.status(400).send("Missing stripe-signature");
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body, // RAW body
        sig as string,
        config.server.STRIPE_WEBHOOK_SECRET
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        // on ne traite que les paiements réellement payés
        if (session.payment_status !== "paid") {
          return res.status(200).json({ received: true });
        }

        const orderId = Number(session.metadata?.order_id);
        if (!Number.isFinite(orderId)) {
          throw new BadRequestError("Missing order_id in metadata");
        }

        // Récupération (facultative) de la méthode de paiement depuis le PaymentIntent
        let paymentMethodLabel: string | null = null;
        const piId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id;

        if (piId) {
          // On expand `latest_charge.payment_method_details` (et `payment_method` en secours)
          const pi = await stripe.paymentIntents.retrieve(piId, {
            expand: ["latest_charge.payment_method_details", "payment_method"],
          });

          // 1) via latest_charge (recommandé)
          if (typeof pi.latest_charge !== "string") {
            const pmd = pi.latest_charge?.payment_method_details;
            if (pmd?.type === "card" && pmd.card) {
              paymentMethodLabel = `card:${pmd.card.brand ?? "unknown"}`;
            } else if (pmd?.type) {
              paymentMethodLabel = pmd.type; // ex: 'sepa_debit', 'paypal', etc.
            }
          }

          // 2) fallback via payment_method (si expand ci-dessus)
          if (!paymentMethodLabel && typeof pi.payment_method === "object") {
            const pm = pi.payment_method as Stripe.PaymentMethod;
            if (pm.type === "card" && pm.card) {
              paymentMethodLabel = `card:${pm.card.brand ?? "unknown"}`;
            } else if (pm.type) {
              paymentMethodLabel = pm.type;
            }
          }
        }

        // Charge la commande
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: {
            order_lines: true,
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
              },
            },
          },
        });
        if (!order) return res.status(200).json({ received: true });

        // Déjà confirmée ? on ne retouche pas
        if (order.status === OrderStatus.confirmed) {
          return res.status(200).json({ received: true });
        }
        // On ne confirme que si elle était pending
        if (order.status !== OrderStatus.pending) {
          return res.status(200).json({ received: true });
        }

        const updated = await prisma.order.update({
          where: { id: orderId },
          data: {
            status: OrderStatus.confirmed,
            // stocke "card:visa", "card:mastercard", "paypal", "sepa_debit", etc.
            payment_method: paymentMethodLabel ?? order.payment_method, // ne casse rien si null
          },
          include: {
            order_lines: true,
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
              },
            },
          },
        });

        const { subtotal, vat_amount, total } = amountsFromLines(
          updated.order_lines.map((l) => ({
            unit_price: l.unit_price,
            quantity: l.quantity,
          })),
          Number(updated.vat)
        );

        return res.status(200).json({
          received: true,
          order_id: updated.id,
          status: updated.status,
          payment_method: updated.payment_method,
          subtotal,
          vat_amount,
          total,
        });
      }

      return res.status(200).json({ received: true });
    } catch (err: unknown) {
      if (err && typeof err == "object") {
        const errorObj = err as { message: string };
        return res.status(400).send(`Webhook Error: ${errorObj.message}`);
      }
    }
  },
};

export default reservationsController;
