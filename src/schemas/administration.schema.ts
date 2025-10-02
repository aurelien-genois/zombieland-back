import { z } from "zod";

// ================================== VALIDATIONS =================================

// --------------------  EMAIL ------------------------
const emailValidation = z.preprocess(
  (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
  z.email({ error: "Invalid email format" })
);

// --------------------  Subject ------------------------
export const SubjectEnum = z.enum(["info", "sav", "support", "autre"]);

export const subjectValidation = SubjectEnum.or(z.literal("")).refine(
  (val) => val !== "",
  { message: "Subject is required." }
);

// --------------------  Description ------------------------
export const descriptionValidation = z
  .string({
    error: (iss) =>
      iss.input === undefined
        ? "Description is required."
        : "Description must be a string.",
  })
  .min(1, { error: "Description cannot be empty" });

// ================================== SCHEMAS =================================

export const administrationSchema = {
  contact: z.object({
    email: emailValidation,
    subject: subjectValidation,
    description: descriptionValidation,
  }),
};
