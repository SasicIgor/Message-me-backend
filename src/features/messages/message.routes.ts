import { Router } from "express";
import { createMessage, deleteMessage, editMessage, getMessages } from "./message.controller.ts";

import { authMiddleware } from "#middleware/auth.middleware.ts";
import { checkChatMembership } from "#middleware/checkChatMembership.middleware.ts";
import { validateBody, validateParams } from "#middleware/validation.middleware.ts";

import { messageSchema } from "#validations/message.validation.ts";
import { paramsSchema } from "#validations/uuid.validation.ts";

const router = Router();

router.get(
  "/:chatId",
  authMiddleware,
  validateParams(paramsSchema),
  checkChatMembership,
  getMessages
);
router.post(
  "/:chatId",
  authMiddleware,
  checkChatMembership,
  validateParams(paramsSchema),
  validateBody(messageSchema),
  createMessage
);
router.patch(
  "/:chatId/:messageId",
  authMiddleware,
  validateParams(paramsSchema),
  validateBody(messageSchema),
  checkChatMembership,
  editMessage
);
router.delete(
  "/:chatId/:messageId",
  authMiddleware,
  validateParams(paramsSchema),
  checkChatMembership,
  deleteMessage
);

export default router;
