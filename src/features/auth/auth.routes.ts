import { Router } from "express";

import { validateBody } from "#middleware/validation.middleware.ts";
import {
  registrationSchema,
  loginSchema,
} from "#validations/user.validation.ts";

import { loginUser, refreshToken, registerUser } from "./auth.controller.ts";

const router = Router();

router
  .post("/register", validateBody(registrationSchema), registerUser)
  .post("/login", validateBody(loginSchema), loginUser)
  .post("/refresh", refreshToken)

export default router;
