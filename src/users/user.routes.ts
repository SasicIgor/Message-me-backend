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
  updateUserSchema,
} from "../validations/user.validation.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";

const router = Router();

router
  .post("/user/register", validateBody(registrationSchema), registerUser)
  // validateBody(loginSchema),
  .post("/user/login", loginUser)
  .patch(
    "/user/update",
    authMiddleware,
    validateBody(updateUserSchema),
    updateUser
  )
  .delete("/user/delete", authMiddleware, deleteUser);
export default router;
