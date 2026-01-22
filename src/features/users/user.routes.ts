import { Router } from "express";

import { updateUser, deleteUser, findByUsername } from "./user.controller.ts";

import { validateBody } from "#middleware/validation.middleware.ts";
import { authMiddleware } from "#middleware/auth.middleware.ts";

import { updateUserSchema } from "#validations/user.validation.ts";

const router = Router();

router
  .get("/:username", authMiddleware, findByUsername)
  .patch(
    "/update",
    authMiddleware,
    validateBody(updateUserSchema),
    updateUser
  )
  .delete("/delete", authMiddleware, deleteUser);
export default router;
