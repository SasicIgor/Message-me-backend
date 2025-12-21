import { Router } from "express";

import { validateBody } from "#middleware/validation.middleware.ts";
import {
  registrationSchema,
  loginSchema,
} from "#validations/user.validation.ts";

import { loginUser, registerUser } from "./auth.controller.ts";

const router = Router();

router
  .post("/user/register", validateBody(registrationSchema), registerUser)
  .post("/user/login", validateBody(loginSchema), loginUser);

export default router;
