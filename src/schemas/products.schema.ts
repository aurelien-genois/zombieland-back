import { z } from "zod";

const productNameValidation = z
  .string({
    error: (iss) =>
      iss.input === undefined
        ? "Name is required"
        : "Name must be a string",
  })
  .min(5, "Name must have at least 5 characters");

const productPriceValidation = z.coerce
  .number({
    error: (iss) =>
      iss.input === undefined
        ? "Price is required"
        : "Price must be a number",
  })
  .positive("Price must be positive");

export const productSchema = {
  create: z.object({
    name: productNameValidation,
    price: productPriceValidation,
    // ⬇︎ seule modif utile ici : on met une valeur par défaut
    status: z.enum(["draft", "published"]).default("published"),
  }),

  update: z.object({
    name: productNameValidation.optional(),
    price: productPriceValidation.optional(),
    status: z.enum(["draft", "published"]).optional(), // déjà bon pour MAJ du status
  }),

  filter: z.object({
    name: productNameValidation.optional(),
    price: productPriceValidation.optional(),
    status: z.enum(["draft", "published"]).optional(),
  }),
};
