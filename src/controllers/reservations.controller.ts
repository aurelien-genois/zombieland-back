import type { Request, Response } from "express";
import { prisma } from "../models/index.js";
import { Prisma } from "@prisma/client";
import { orderLineSchema, orderSchema } from "../schemas/reservation.schema.js";
import {BadRequestError, NotFoundError, UnauthorizedError,} from "../lib/errors.js";
import { parseIdValidation } from "../schemas/utils.schema.js";

function generateTicketCode() {
  return `ZMB-${new Date().getFullYear()}-${Date.now()}-${Math.floor(Math.random()*1e6)}`
    .toUpperCase();
}

function amountsFromLines(
  lines: Array<{ unit_price: number; quantity: number }>,
  vat: Prisma.Decimal | number
) {
  const subtotalD = lines.reduce(
    (sum, line) => sum.plus(new Prisma.Decimal(line.unit_price).mul(line.quantity)),
    new Prisma.Decimal(0)
  );

  const vatD = subtotalD.mul(vat).div(100);      // vat = 5.5 => 5.5%
  const totalD = subtotalD.plus(vatD);

  // arrondis à 2 décimales
  const subtotal = +subtotalD.toDecimalPlaces(2).toString();
  const vat_amount = +vatD.toDecimalPlaces(2).toString();
  const total = +totalD.toDecimalPlaces(2).toString();

  return { subtotal, vat_amount, total };
}

const reservationsController = {
  // GET All reservations + Pagination + Queries
  async getAllOrders(
    req: Request, 
    res: Response
  ) {
    
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
    const whereClause: Prisma.OrderWhereInput = {
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
          { payment_method: { contains: search, mode: "insensitive" } },
          { user: { email: { contains: search, mode: "insensitive" } } },
          { user: { firstname: { contains: search, mode: "insensitive" } } },
          { user: { lastname: { contains: search, mode: "insensitive" } } },
        ],
      }),
    };
    const orderBy: Prisma.OrderOrderByWithRelationInput =
      order === "order_date:asc"  ? { order_date: "asc"  } :
      order === "order_date:desc" ? { order_date: "desc" } :
      order === "visit_date:asc"  ? { visit_date: "asc"  } :
      order === "visit_date:desc" ? { visit_date: "desc" } :
                                    { order_date: "desc" };

    const totalOrders = await prisma.order.count({
      where: whereClause,
    });
    const orders = await prisma.order.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: orderBy,
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
    const ordersWithTotals = orders.map((order) => {
      const lines = order.order_lines.map((line) => {
        const unit = line.unit_price;
        
        const lineTotal = +(unit * line.quantity).toFixed(2); 
    
        return {
          ...line,
          computed_line_total_price: lineTotal,
        };
      });
    
      const orderTotal = +lines
        .reduce((sum, line) => sum + line.computed_line_total_price, 0)
        .toFixed(2);
    
      return {
        ...order,
        order_lines: lines,
        computed_order_total_price: orderTotal,
      };
    });
    res.status(200).json({ordersWithTotals, totalOrders});
  },

  async getUserOrders(
    req: Request, 
    res: Response
  ) {
    const targetUserId = await parseIdValidation.parseAsync(req.params.user_id);
    const userRole = req.userRole as string | undefined;
    const userId = req.userId;

    if (userRole !== "admin" && targetUserId !== userId) {
      throw new UnauthorizedError("Unauthorized - You can only view your own orders");
    }

    const { status, limit, page, order } = await orderSchema.userOrders.parseAsync({
      ...req.query,
      user_id: targetUserId,
    });

    const orderBy: Prisma.OrderOrderByWithRelationInput =
      order === "order_date:asc"  ? { order_date: "asc"  } :
      order === "order_date:desc" ? { order_date: "desc" } :
      order === "visit_date:asc"  ? { visit_date: "asc"  } :
      order === "visit_date:desc" ? { visit_date: "desc" } :
                                    { order_date: "desc" };

    const totalOrders = await prisma.order.count({
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
      orderBy: orderBy,
      include: {
        order_lines: {
          include: {
            product: true,
          },
        },
      },
    });

    const ordersWithTotals = orders.map((order) => {
      const lines = order.order_lines.map((line) => {
        const unit = line.unit_price;
        
        const lineTotal = +(unit * line.quantity).toFixed(2); 
    
        return {
          ...line,
          computed_line_total_price: lineTotal,
        };
      });
    
      const orderTotal = +lines
        .reduce((sum, line) => sum + line.computed_line_total_price, 0)
        .toFixed(2);
    
      return {
        ...order,
        order_lines: lines,
        computed_order_total_price: orderTotal,
      };
    });
    res.status(200).json({ordersWithTotals, totalOrders});
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
      throw new UnauthorizedError("Unauthorized - You can only view your own orders");
    }

    const lines = order.order_lines.map((line) => {
      const unitPrice = line.unit_price;
      const lineTotalPrice = +(unitPrice * line.quantity).toFixed(2);
      return {
        ...line,
        computed_line_total_price: lineTotalPrice,
      };
    })
    
      const orderTotal = +lines
        .reduce((sum, line) => sum + line.computed_line_total_price, 0)
        .toFixed(2);

    

    res.status(200).json({
      ...order,
      order_lines: lines,
      total_order: orderTotal,
    });
  },

  async createOrder(req: Request, res: Response) {
    if (!req.userId) {
      throw new UnauthorizedError("Unauthorized - Must be logged in");
    }
    const { visit_date, vat, payment_method, order_lines } = await orderSchema.create.parseAsync(req.body);

    // check if visit_date is on future
    if (new Date(visit_date) <= new Date()) {
      throw new BadRequestError("Visit date must be in the future");
    }

    // Vérify existing user
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // if lines, fix current_price
    let createLines:
    | { create: Array<{ product_id: number; quantity: number; unit_price: number }> }
    | undefined;

    if (order_lines && order_lines.length > 0) {
      const ids = order_lines.map(line => line.product_id);
      const products = await prisma.product.findMany({ where: { id: { in: ids } } });
      if (products.length !== ids.length) {
        throw new NotFoundError("One or more products not found");
      }

      createLines = {
        create: order_lines.map(line => {
          const productLine = products.find(product => product.id === line.product_id)!;
          return {
            product_id: line.product_id,
            quantity: line.quantity,
            // snapshot 
            unit_price: productLine.price, 
          };
        }),
      };
    }
    // create order
    const order = await prisma.order.create({
      data: {
        status: "pending",
        visit_date,
        vat,
        payment_method,
        user_id: req.userId,
        ticket_code: generateTicketCode(),
        ...(createLines && { order_lines: createLines }),
      },
      include: {
        order_lines: { include: { product: { select: { id: true, name: true } } } },
        user: { select: { id: true, firstname: true, lastname: true, email: true } },
      },
    });

 
    const { subtotal, vat_amount, total } = amountsFromLines(
      order.order_lines.map(line => ({ unit_price: line.unit_price, quantity: line.quantity })),
      order.vat
    );
    res.status(201).json({ ...order, subtotal, vat_amount, total });
  },

  async addOrderLines(req: Request, res: Response) {
    const orderId = await parseIdValidation.parseAsync(req.params.id);
    const { quantity, product_id } = await orderLineSchema.create.parseAsync(req.body);
    const userId = req.userId;
    const role = req.userRole as string | undefined;
  
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });
    if (!order) throw new NotFoundError("Order not found");

    if (role !== "admin" && order.user_id !== userId) {
      throw new UnauthorizedError("Unauthorized - You can only modify your own orders");
    }
    if (order.status !== "pending") {
      throw new BadRequestError("Can only add lines to pending orders");
    }
  
    const product = await prisma.product.findUnique({ where: { id: product_id } });
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
      throw new UnauthorizedError("Unauthorized - You can only modify your own orders");
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
    if (!line){
      throw new NotFoundError("Order line not found");
    } 
    if (role !== "admin" && line.order.user_id !== userId) {
      throw new UnauthorizedError("Unauthorized - You can only modify your own orders");
    }
    if (line.order.status !== "pending") {
      throw new BadRequestError("Can only delete lines from pending orders");
    }
  
    await prisma.orderLine.delete({ where: { id: lineId } });
    res.status(204).json();
  }
  
  
};

export default reservationsController;