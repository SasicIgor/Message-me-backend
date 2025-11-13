import { z } from "zod";

const passRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const registrationSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must have at least 3 characters")
      .max(20, "Username must be less then 20 characters"),
    email: z.email("Invalid email").trim(),
    password: z
      .string()
      .regex(
        passRegex,
        "Password must have one upper letter, one lower case letter, one number and one special sign"
      ),
    confirmedPassword: z
      .string()
      .regex(
        passRegex,
        "Password must have one upper letter, one lower case letter, one number and one special sign"
      ),
  })
  .refine(
    (data) => data.password === data.confirmedPassword,
    "Password need to match"
  );

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must have at least 3 characters")
    .max(20, "Username must be less then 20 characters"),
  password: z
    .string()
    .regex(
      passRegex,
      "Password must have one upper letter, one lower case letter, one number and one special sign"
    ),
});
