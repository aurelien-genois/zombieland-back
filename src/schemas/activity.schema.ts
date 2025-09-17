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
  .min(5, "Name must have at least 5 characters")
  .optional();

const activityMinimumAgeValidation = z.coerce
  .number({
    error: (iss) =>
      iss.input === undefined ? "Age is required" : "Age must be a number",
  })
  .positive("Age must be positive")
  .int("Age must be an integer")
  .min(1, "Age must be between 1 and 3")
  .max(3, "Age must be between 1 and 3");

const activityDurationValidation = z.coerce
  .number({
    error: (iss) =>
      iss.input === undefined
        ? "Duration is required"
        : "Duration must be a number",
  })
  .positive("Duration must be positive")
  .optional();

const activityImageUrlValidation = z
  .string({
    error: (iss) =>
      iss.input === undefined
        ? "Image url is required"
        : "Image url must be a string",
  })
  .min(5, "Name must have at least 5 characters")
  .optional();

// TODO rework "z.coerce.boolean()" to accept both "false" and false values
// ("false" is actually coerced to true as a string)

export const activitySchema = {
  create: z.object({
    name: activityNameValidation,
    description: activityDescriptionValidation,
    minimum_age: activityMinimumAgeValidation,
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
    minimum_age: activityMinimumAgeValidation.optional(),
    duration: activityDurationValidation,
    disabled_access: z.coerce.boolean().optional(),
    high_intensity: z.coerce.boolean().optional(),
    image_url: activityImageUrlValidation,
    category_id: parseIdValidation.optional(),
    saved: z.coerce.boolean().optional(),
  }),
};
