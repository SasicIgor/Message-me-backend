import { Router } from "express";
import {
  getOrCreatePrivateChat,
  deleteChat,
  getUserChats,
  createGroupChat,
  updateChatName,
  updateChatMember,
} from "./chat.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import { checkChatMembership } from "../middleware/checkChatMembership.middleware.ts";

const router = Router();

router.get("/", authMiddleware, getUserChats);
router.post("/private", authMiddleware, getOrCreatePrivateChat);
router.post("/group", authMiddleware, createGroupChat);
router.put("/:chatId", authMiddleware, checkChatMembership, updateChatName);
router.patch("/:chatId", authMiddleware, checkChatMembership, updateChatMember);
router.delete("/:chatId", authMiddleware, checkChatMembership, deleteChat);

export default router;
