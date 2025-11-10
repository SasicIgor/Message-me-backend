import { Router } from "express";
import { login, register } from "../controllers/auth.controller.ts";
import { validateBody } from "../middleware/validation.middleware.ts";
import {
  loginSchema,
  registrationSchema,
} from "../validations/userValidation.ts";

const router = Router();

router
  .post("/register", validateBody(registrationSchema), register)
  .post("/login", login);
// validateBody(loginSchema),
export default router;
