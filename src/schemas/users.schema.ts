import { token } from "morgan";
import { email, z } from "zod";

// ================================== VALIDATIONS =================================

// --------------------  EMAIL ------------------------
const emailValidation = z.preprocess(
  (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
  z.email({ error: "Invalid email format" })
);

// --------------------  Firstname ------------------------
const firstnameValidation = z
  .string({
    error: (iss) =>
      iss.input === undefined
        ? "Firstname is required."
        : "Firstname must be a string.",
  })
  .min(1, { error: "Firstname cannot be empty" });

// --------------------  Lastname ------------------------
const lastnameValidation = z
  .string({
    error: (iss) =>
      iss.input === undefined
        ? "Lastname is required."
        : "Lastname must be a string.",
  })
  .min(1, { error: "Lastname cannot be empty" });

// --------------------  Password ------------------------

const passwordValidation = z
  .string({
    error: (iss) =>
      iss.input === undefined ? "Password is required." : "Invalid Password.",
  })
  .min(10, { error: "Password should have minimum length of 10" })
  .max(100, { error: "Password is too long" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    error:
      "Password must include at least 1 special character, 1 uppercase letter, 1 lowercase letter, and 1 number",
  });

// --------------------  is_active ------------------------

const isActiveValidation = z.boolean({ error: "is_active must be a boolean" });

// --------------------  Phone ------------------------

const phoneValidation = z
  .string({
    error: (iss) =>
      iss.input === undefined
        ? "Phone number is required."
        : "Phone number must be a string.",
  })
  .min(1, { error: "Phone number cannot be empty" });

// --------------------  Birthday ------------------------

const birthdayValidation = z.preprocess(
  (val) => (typeof val === "string" ? new Date(val) : val),
  z.date({
    error: (iss) =>
      iss.input === undefined
        ? "Birthday is required."
        : "Birthday must be a valid date.",
  })
);

// --------------------  Last_Login ------------------------

const lastLoginValidation = z.preprocess(
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

const tokenValidation = z.uuid({ error: "Token must be a valid UUID" });

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
      is_active: isActiveValidation.optional(),
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
