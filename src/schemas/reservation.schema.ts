import { z } from "zod";
import { parseIdValidation } from "./utils.schema.js";

// ============== validations =============== //

// Order
const orderStatusValidation = z.enum(
  ["pending", "confirmed", "canceled", "refund"] as const
);

const orderVisitDateValidation = z.coerce
  .date()
  .refine(
    (date) => date >= new Date(),
    "Visit date must be in the future"
  );

const orderVatValidation = z.coerce
  .number()
  .min(0, "VAT must be positive")
  .max(100, "VAT must be less than 100")
  .multipleOf(0.01, "VAT must have maximum 2 decimal places");

const orderPaymentMethodValidation = z
  .string()
  .min(2, "Payment method must have at least 2 characters");

// OrderLine
const orderLineQuantityValidation = z.coerce
  .number()
  .int("Quantity must be an integer")
  .positive("Quantity must be positive")
  .min(1, "Quantity must be at least 1")
  .max(20, "Quantity cannot exceed 20 tickets per line");

const orderLineTotalPriceValidation = z.coerce
  .number()
  .int("Price must be an integer (in cents)")
  .positive("Price must be positive");

const orderLineTicketCodeValidation = z
  .string()
  .min(6, "Ticket code must have at least 6 characters")
  .regex(/^[A-Z0-9-]+$/, "Ticket code must contain only uppercase letters, numbers and hyphens");

// ============== Schema =============== //

//OrderLine
export const orderLineSchema = {
  // Create
  create: z.object({
    line_total_price: orderLineTotalPriceValidation,
    quantity: orderLineQuantityValidation,
    ticket_code: orderLineTicketCodeValidation,
    product_id: parseIdValidation,
    order_id: parseIdValidation,
  }),
  // Update 
  update: z.object({
    line_total_price: orderLineTotalPriceValidation.optional(),
    quantity: orderLineQuantityValidation.optional(),
    ticket_code: orderLineTicketCodeValidation.optional(),
    product_id: parseIdValidation.optional(),
  }),
};

// Order
export const orderSchema = {
  // Créate
  create: z.object({
    visit_date: orderVisitDateValidation,
    vat: orderVatValidation.default(5.5),
    payment_method: orderPaymentMethodValidation,
    user_id: parseIdValidation,
    order_lines: z.array(
      z.object({
        quantity: orderLineQuantityValidation,
        product_id: parseIdValidation,
      })
    ).min(1, "At least one product must be ordered").optional(),
  }),

  // order statut
  updateStatus: z.object({
    status: orderStatusValidation,
  }),

  // Update order
  update: z.object({
    status: orderStatusValidation.optional(),
    visit_date: orderVisitDateValidation.optional(),
    vat: orderVatValidation.optional(),
    payment_method: orderPaymentMethodValidation.optional(),
  }),

  // payment status
  ipn: z.object({
    order_id: parseIdValidation,
    payment_status: z.enum(["success", "failed", "pending"] as const),
    transaction_id: z.string().min(1, "Transaction ID is required"),
    payment_amount: z.coerce.number().positive("Payment amount must be positive"),
    payment_date: z.coerce.date(),
  }),

  // GET filters with pagination & queries
  filter: z.object({
    status: orderStatusValidation.optional(),
    user_id: parseIdValidation.optional(),
    visit_date_from: z.coerce.date().optional(),
    visit_date_to: z.coerce.date().optional(),
    order_date_from: z.coerce.date().optional(),
    order_date_to: z.coerce.date().optional(),
    payment_method: z.string().optional(),
    min_amount: z.coerce.number().positive().optional(),
    max_amount: z.coerce.number().positive().optional(),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    page: z.coerce.number().int().min(1).optional().default(1),
    order: z.enum([
      "order_date:asc", 
      "order_date:desc",
      "visit_date:asc",
      "visit_date:desc",
      "status:asc",
      "status:desc"
    ] as const).default("order_date:desc").optional(),
    search: z
      .string()
      .min(1)
      .max(100)
      .regex(/^[a-zA-Z0-9\s-_]+$/) // Only allow alphanumeric chars, spaces, hyphens, underscores
      .transform((val) => val.trim())
      .optional(),
  }),

  // GET user orders
  userOrders: z.object({
    user_id: parseIdValidation,
    status: orderStatusValidation.optional(),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    page: z.coerce.number().int().min(1).optional().default(1),
    order: z.enum([
      "order_date:asc", 
      "order_date:desc",
      "visit_date:asc",
      "visit_date:desc"
    ] as const).default("order_date:desc").optional(),
  }),
};