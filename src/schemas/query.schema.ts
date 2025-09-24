import z from "zod";
import {
  emailValidation,
  firstnameValidation,
  lastnameValidation,
} from "./users.schema.js";

// ================================== VALIDATIONS =================================

export const limitValidation = z.coerce
  .number()
  .int()
  .min(1)
  .max(100)
  .default(20);

export const offsetValidation = z.coerce.number().int().min(0).default(0);

export const directionValidation = z.enum(["asc", "desc"]).default("asc");

export const orderByValidation = z.string().optional();

export const pageValidation = z.coerce.number().int().min(1).default(1);

export const orderValidationUser = z
  .enum(["created_at:asc", "created_at:desc", "lastname:asc", "lastname:desc"])
  .default("created_at:desc");

export const qValidation = z.string().optional();

// ================================== SCHEMAS =================================

export const querySchema = {
  userPagination: z.object({
    limit: limitValidation,
    page: pageValidation,
    order: orderValidationUser,
    firstname: firstnameValidation.optional(),
    lastname: lastnameValidation.optional(),
    email: emailValidation.optional(),
    q: qValidation,
  }),
};
