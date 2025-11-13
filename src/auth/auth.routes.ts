import { Router } from "express";
import { login, register } from "./auth.controller.ts";
import { validateBody } from "../middleware/validation.middleware.ts";
import {
  loginSchema,
  registrationSchema,
} from "../validations/user-validation.ts";

const router = Router();

router
  .post("/register", validateBody(registrationSchema), register)
  .post("/login", login);
// validateBody(loginSchema),
export default router;
