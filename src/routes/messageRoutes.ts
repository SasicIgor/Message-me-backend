import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  editMessage,
  getMessages,
} from "../controllers/messageController.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { checkChatMembership } from "../middleware/checkChatMembership.ts";

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
  createMessage
);
router.patch(
  "/messages/:chatId",
  authMiddleware,
  checkChatMembership,
  editMessage
);
router.delete(
  "/messages/:chatId",
  authMiddleware,
  checkChatMembership,
  deleteMessage
);

export default router;
