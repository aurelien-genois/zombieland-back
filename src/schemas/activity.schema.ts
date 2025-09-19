import { z } from "zod";
import { parseIdValidation } from "./utils.schema.js";

const activityNameValidation = z
  .string({
    error: (iss) =>
      iss.input === undefined ? "Name is required" : "Name must be a string",
  })
  .min(3, "Name must have at least 3 characters");

const activityDescriptionValidation = z
  .string({
    error: (iss) =>
      iss.input === undefined
        ? "Description is required"
        : "Description must be a string",
  })
  .min(5, "Name must have at least 5 characters");

const activitySloganValidation = z
  .string({
    error: (iss) =>
      iss.input === undefined ? undefined : "Slogan must be a string",
  })
  .min(5, "Name must have at least 5 characters")
  .optional();

const activityAgeGroupValidation = z.coerce
  .number({
    error: (iss) =>
      iss.input === undefined ? "Age is required" : "Age must be a number",
  })
  .positive("Age must be positive")
  .int("Age must be an integer")
  .min(0, "Age must be between 0 and 3")
  .max(3, "Age must be between 0 and 3");

const activityDurationValidation = z.coerce
  .string({
    error: (iss) =>
      iss.input === undefined ? undefined : "Duration must be a string",
  })
  .optional();

const activityImageUrlValidation = z
  .string({
    error: (iss) =>
      iss.input === undefined ? undefined : "Image url must be a string",
  })
  .min(5, "Name must have at least 5 characters")
  .optional();

// TODO rework "z.coerce.boolean()" to accept both "false" and false values
// ("false" is actually coerced to true as a string)

export const activitySchema = {
  create: z.object({
    name: activityNameValidation,
    slogan: activitySloganValidation,
    description: activityDescriptionValidation,
    age_group: activityAgeGroupValidation,
    duration: activityDurationValidation,
    disabled_access: z.coerce.boolean().default(false),
    high_intensity: z.coerce.boolean().default(false),
    image_url: activityImageUrlValidation,
    category_id: parseIdValidation,
    saved: z.coerce.boolean().default(false),
  }),
  update: z.object({
    name: activityNameValidation.optional(),
    description: activityDescriptionValidation.optional(),
    slogan: activitySloganValidation,
    age_group: activityAgeGroupValidation.optional(),
    duration: activityDurationValidation,
    disabled_access: z.coerce.boolean().optional(),
    high_intensity: z.coerce.boolean().optional(),
    image_url: activityImageUrlValidation,
    category_id: parseIdValidation.optional(),
    saved: z.coerce.boolean().optional(),
  }),
  filter: z.object({
    category: parseIdValidation.optional(),
    age_group: activityAgeGroupValidation.optional(),
    high_intensity: z
      .enum(["true", "false"])
      .optional()
      .transform((val) => {
        if (val === undefined) return undefined;
        return val === "true";
      }),
    disabled_access: z
      .enum(["true", "false"])
      .optional()
      .transform((val) => {
        if (val === undefined) return undefined;
        return val === "true";
      }),
    limit: z.coerce.number().int().min(1).optional().default(20),
    page: z.coerce.number().int().min(1).optional().default(1),
    order: z.enum(["name:asc", "name:desc"]).default("name:asc").optional(),
    search: z
      .string()
      .min(1)
      .max(100) // Limit maximum length
      .regex(/^[a-zA-Z0-9\s-_]+$/) // Only allow alphanumeric chars, spaces, hyphens, underscores
      .transform((val) => val.trim()) // Remove leading/trailing spaces
      .optional(),
    status: z.enum(["draft", "published"]).optional(),
  }),
};
