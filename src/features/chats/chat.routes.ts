import { Router } from "express";

import {
  getOrCreatePrivateChat,
  deleteChat,
  getUserChats,
  createGroupChat,
  updateChatName,
  updateChatMember,
} from "./chat.controller.ts";

import { authMiddleware } from "#middleware/auth.middleware.ts";
import { checkChatMembership } from "#middleware/checkChatMembership.middleware.ts";
import { validateBody, validateParams} from "#middleware/validation.middleware.ts";

import { paramsSchema } from "#validations/uuid.validation.ts";
import {
  createGroupChatSchema,
  getOrCreatePrivateChatSchema,
  updateChatMembersSchema,
  updateChatNameSchema,
} from "#validations/chat.validation.ts";

const router = Router();

router.get("/", authMiddleware, getUserChats);
router.post(
  "/private",
  authMiddleware,
  validateBody(getOrCreatePrivateChatSchema),
  getOrCreatePrivateChat
);
router.post(
  "/group",
  authMiddleware,
  validateBody(createGroupChatSchema),
  createGroupChat
);
router.put(
  "/:chatId",
  authMiddleware,
  validateParams(paramsSchema),
  validateBody(updateChatNameSchema),
  checkChatMembership,
  updateChatName
);
router.patch(
  "/:chatId",
  authMiddleware,
  validateParams(paramsSchema),
  validateBody(updateChatMembersSchema),
  checkChatMembership,
  updateChatMember
);
router.delete(
  "/:chatId",
  authMiddleware,
  validateParams(paramsSchema),
  checkChatMembership,
  deleteChat
);

export default router;
