import { Router } from "express";
import { login, register } from "../controllers/authController.ts";
import { validateBody } from "../middleware/validation.ts";
import { registrationSchema } from "../validations/userValidation.ts";

const router = Router();

router
  .post("/register", validateBody(registrationSchema), register)
  .post("/login", login);

export default router;
