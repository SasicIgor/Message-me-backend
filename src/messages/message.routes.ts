import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  editMessage,
  getMessages,
} from "./message.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import { checkChatMembership } from "../middleware/checkChatMembership.middleware.ts";
import { validateBody } from "../middleware/validation.middleware.ts";
import {
  createMsgSchema,
  editMsgSchema,
} from "../validations/message-validation.ts";

const router = Router();

router.get(
  "/:chatId",
  authMiddleware,
  checkChatMembership,
  getMessages
);
router.post(
  "/:chatId",
  authMiddleware,
  checkChatMembership,
  validateBody(createMsgSchema),
  createMessage
);
router.patch(
  "/:chatId/:messageId",
  authMiddleware,
  checkChatMembership,
  validateBody(editMsgSchema),
  editMessage
);
router.delete(
  "/:chatId/:messageId",
  authMiddleware,
  checkChatMembership,
  deleteMessage
);

export default router;
