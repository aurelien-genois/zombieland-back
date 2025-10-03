import { z } from "zod";

const categoryNameValidation = z
  .string({
    error: (iss) =>
      iss.input === undefined ? "Name is required" : "Name must be a string",
  })
  .min(3, "Name must have at least 3 characters");

//   hexadecimal
const colorHexaValidation = z
  .string({
    error: (iss) =>
      iss.input === undefined ? "Color is required" : "Color must be a string",
  })
  .regex(
    /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/,
    "Color must be a valid hexadecimal color code"
  );

export const categorySchema = {
  create: z.object({
    name: categoryNameValidation,
    color: colorHexaValidation,
  }),
  update: z.object({
    name: categoryNameValidation.optional(),
    color: colorHexaValidation.optional(),
  }),
  filter: z.object({
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    page: z.coerce.number().int().min(1).optional().default(1),
    order: z.enum(["name:asc", "name:desc"]).default("name:asc").optional(),
    search: z
      .string()
      .min(1)
      .max(100) // Limit maximum length
      .regex(/^[a-zA-Z0-9\s-_]+$/) // Only allow alphanumeric chars, spaces, hyphens, underscores
      .transform((val) => val.trim()) // Remove leading/trailing spaces
      .optional(),
  }),
};
