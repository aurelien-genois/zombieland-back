import { z } from "zod";

// ================================== VALIDATIONS =================================

// --------------------  EMAIL ------------------------
export const emailValidation = z.preprocess(
  (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
  z.email({ error: "Invalid email format" })
);

// --------------------  Firstname ------------------------
export const firstnameValidation = z.preprocess(
  (v) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ") : v),
  z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "Firstname is required."
          : "Firstname must be a string.",
    })
    .min(2, { error: "Firstname must be at least 2 characters." })
    .max(100, { error: "Firstname must be at most 50 characters." })
    .regex(/^[\p{L}][\p{L}' -]*$/u, {
      error: "Firstname contains invalid characters.",
    })
);

// --------------------  Lastname ------------------------
export const lastnameValidation = z
  .string({
    error: (iss) =>
      iss.input === undefined
        ? "Lastname is required."
        : "Lastname must be a string.",
  })
  .min(2, { error: "Lastname cannot be empty" })
  .max(100, { error: "Lastname must be at most 50 characters." })
  .regex(/^[\p{L}][\p{L}' -]*$/u, {
    error: "Lastname contains invalid characters.",
  });

// --------------------  Password ------------------------

export const passwordValidation = z
  .string({
    error: (iss) =>
      iss.input === undefined ? "Password is required." : "Invalid Password.",
  })
  .min(12, { error: "Password should have minimum length of 10" })
  .max(100, { error: "Password is too long" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    error:
      "Password must include at least 1 special character, 1 uppercase letter, 1 lowercase letter, and 1 number",
  });

// --------------------  is_active ------------------------

export const isActiveValidation = z.boolean({
  error: "is_active must be a boolean",
});

// --------------------  Phone ------------------------

export const phoneValidation = z
  .string({
    error: (iss) =>
      iss.input === undefined
        ? "Phone number is required."
        : "Phone number must be a string.",
  })
  .min(4, { error: "Phone number cannot be empty" })
  .max(20, { error: "Phone number must be at most 20 characters." })
  .regex(/^\+?[0-9\s\-()]+$/, {
    error: "Phone number contains invalid characters.",
  });

// --------------------  Birthday ------------------------

export const birthdayValidation = z.preprocess(
  (val) => (typeof val === "string" ? new Date(val) : val),
  z.date({
    error: (iss) =>
      iss.input === undefined
        ? "Birthday is required."
        : "Birthday must be a valid date.",
  })
);

// --------------------  Last_Login ------------------------

export const lastLoginValidation = z.preprocess(
  (val) => (typeof val === "string" ? new Date(val) : val),
  z
    .date({
      error: (iss) =>
        iss.input === undefined
          ? "Last login is required."
          : "Last login must be a valid date.",
    })
    .optional()
);

// --------------------  Token ------------------------

export const tokenValidation = z.uuid({ error: "Token must be a valid UUID" });

// ================================== SCHEMAS =================================

export const usersSchema = {
  register: z
    .object({
      firstname: firstnameValidation,
      lastname: lastnameValidation,
      email: emailValidation,
      password: passwordValidation,
      confirmation: passwordValidation,
      phone: phoneValidation,
      birthday: birthdayValidation,
      last_login: lastLoginValidation,
    })
    .refine((data) => data.password === data.confirmation, {
      message: "Passwords do not match",
      path: ["confirmation"],
    }),

  login: z.object({
    email: emailValidation,
    password: passwordValidation,
  }),

  email: z.object({ email: emailValidation }),

  token: z.object({ token: tokenValidation }),

  resetPassword: z
    .object({
      newPassword: passwordValidation,
      confirmation: passwordValidation,
    })
    .refine((data) => data.newPassword === data.confirmation, {
      message: "Passwords do not match",
      path: ["confirmation"],
    }),

  changePassword: z
    .object({
      oldPassword: passwordValidation,
      newPassword: passwordValidation,
      confirmation: passwordValidation,
    })
    .refine((data) => data.newPassword === data.confirmation, {
      message: "Passwords do not match",
      path: ["confirmation"],
    }),

  updateInfo: z.object({
    firstname: firstnameValidation.optional(),
    lastname: lastnameValidation.optional(),
    email: emailValidation.optional(),
    phone: phoneValidation.optional(),
    birthday: birthdayValidation.optional(),
  }),
};
