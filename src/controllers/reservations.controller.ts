import type { Request, Response } from "express";
import { prisma } from "../models/index.js";
import { Prisma } from "@prisma/client";
import { orderSchema } from "../schemas/reservation.schema.js";
import {UnauthorizedError,} from "../lib/errors.js";
import { parseIdValidation } from "../schemas/utils.schema.js";

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
        const unit = line.current_price;
        
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
        const unit = line.current_price;
        
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
  }
};

export default reservationsController;