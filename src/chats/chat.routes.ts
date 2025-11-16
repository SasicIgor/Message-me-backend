import { Router } from "express";
import {
  createChat,
  deleteChat,
  getOneChat,
  getUserChats,
  updateChat,
} from "./chat.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";

const router = Router();

router.get("/", authMiddleware, getUserChats);
router.post("/", authMiddleware, createChat);
router.get("/:chatId", authMiddleware, getOneChat);
router.patch("/:chatId", authMiddleware, updateChat);
router.delete("/:chatId", authMiddleware, deleteChat);

export default router;
