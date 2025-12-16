import { Router } from "express";
import {
  loginUser,
  registerUser,
  updateUser,
  deleteUser,
  findByUsername,
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
  .get("/user/:username", findByUsername)
  .post("/user/register", validateBody(registrationSchema), registerUser)
  .post("/user/login", validateBody(loginSchema), loginUser)
  .patch(
    "/user/update",
    authMiddleware,
    validateBody(updateUserSchema),
    updateUser
  )
  .delete("/user/delete", authMiddleware, deleteUser);
export default router;
