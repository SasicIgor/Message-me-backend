import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  editMessage,
  getMessages,
} from "../controllers/message.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import { checkChatMembership } from "../middleware/checkChatMembership.middleware.ts";
import { validateBody } from "../middleware/validation.middleware.ts";
import {
  createMsgSchema,
  editMsgSchema,
} from "../validations/message-validation.ts";

const router = Router();

router.get(
  "/messages/:chatId",
  authMiddleware,
  checkChatMembership,
  getMessages
);
router.post(
  "/messages/:chatId",
  authMiddleware,
  checkChatMembership,
  validateBody(createMsgSchema),
  createMessage
);
router.patch(
  "/messages/:chatId/:messageId",
  authMiddleware,
  checkChatMembership,
  validateBody(editMsgSchema),
  editMessage
);
router.delete(
  "/messages/:chatId/:messageId",
  authMiddleware,
  checkChatMembership,
  deleteMessage
);

export default router;
