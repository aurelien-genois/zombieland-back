import { z } from "zod";

// ================================== VALIDATIONS =================================

// --------------------  paramsId ------------------------
export const parseIdValidation = z.coerce
  .number({ error: "Parameter is required" })
  .int({ error: "Parameter should be a positif number!" })
  .min(1, { error: "Parameter must be a positive integer" });

export const parseSlugValidation = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, { message: "Invalid slug format" })
  .min(1);

// ================================== SCHEMAS =================================

export const utilSchema = {
  parseId: z.object({
    id: parseIdValidation,
  }),
};
