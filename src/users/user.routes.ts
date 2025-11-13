import { Router } from "express";
import {
  loginUser,
  registerUser,
  updateUser,
  deleteUser,
} from "./user.controller.ts";
import { validateBody } from "../middleware/validation.middleware.ts";
import {
  loginSchema,
  registrationSchema,
} from "../validations/user-validation.ts";

const router = Router();

router
  .post("/user/register", validateBody(registrationSchema), registerUser)
  // validateBody(loginSchema),
  .post("/user/login", loginUser)
  .put("/user", updateUser)
  .delete("/user", deleteUser);
export default router;
