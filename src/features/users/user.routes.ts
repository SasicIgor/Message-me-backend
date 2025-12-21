import { Router } from "express";

import { updateUser, deleteUser, findByUsername } from "./user.controller.ts";

import { validateBody } from "#middleware/validation.middleware.ts";
import { authMiddleware } from "#middleware/auth.middleware.ts";

import { updateUserSchema } from "#validations/user.validation.ts";

const router = Router();

router
  .get("/user/:username", findByUsername)
  .patch(
    "/user/update",
    authMiddleware,
    validateBody(updateUserSchema),
    updateUser
  )
  .delete("/user/delete", authMiddleware, deleteUser);
export default router;
