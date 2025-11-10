import { Router } from "express";
import {
  createMessage,
  getMessages,
} from "../controllers/messageController.ts";
import { authMiddleware } from "../middleware/auth.ts";

const router = Router();
router.get("/messages/:chatId", authMiddleware, getMessages);
router.post("/messages/:chatId", authMiddleware, createMessage);

export default router;
