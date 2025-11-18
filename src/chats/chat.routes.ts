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

const router = Router();

router.get("/", authMiddleware, getUserChats);
router.post("/private", authMiddleware, getOrCreatePrivateChat);
router.post("/group", authMiddleware, createGroupChat);
router.put("/:chatId", authMiddleware, updateChatName);
router.patch("/:chatId", authMiddleware, updateChatMember);
router.delete("/:chatId", authMiddleware, deleteChat);

export default router;
