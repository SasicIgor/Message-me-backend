import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  editMessage,
  getMessages,
} from "../controllers/messageController.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { checkChatMembership } from "../middleware/checkChatMembership.ts";
import { validateBody } from "../middleware/validation.ts";
import {
  createMsgSchema,
  deleteMsgSchema,
  editMsgSchema,
} from "../validations/messageValidation.ts";

const router = Router();
const route = "/messages/:chatId";

router.get(route, authMiddleware, checkChatMembership, getMessages);
router.post(
  route,
  authMiddleware,
  checkChatMembership,
  validateBody(createMsgSchema),
  createMessage
);
router.patch(
  route,
  authMiddleware,
  checkChatMembership,
  validateBody(editMsgSchema),
  editMessage
);
router.delete(
  route,
  authMiddleware,
  checkChatMembership,
  validateBody(deleteMsgSchema),
  deleteMessage
);

export default router;
