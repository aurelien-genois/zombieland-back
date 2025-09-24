import z from "zod";
import {
  emailValidation,
  firstnameValidation,
  lastnameValidation,
} from "./users.schema.js";

// ================================== VALIDATIONS =================================

const limitValidation = z.coerce.number().int().min(1).max(100).default(20);

const pageValidation = z.coerce.number().int().min(1).default(1);

const orderValidationUser = z
  .enum(["created_at:asc", "created_at:desc", "lastname:asc", "lastname:desc"])
  .default("created_at:desc");

const qValidation = z.string().optional();

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
