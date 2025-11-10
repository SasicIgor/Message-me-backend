import { Router } from "express";
import {
  createMessage,
  editMessage,
  getMessages,
} from "../controllers/messageController.ts";
import { authMiddleware } from "../middleware/auth.ts";

const router = Router();
router.get("/messages/:chatId", authMiddleware, getMessages);
router.post("/messages/:chatId", authMiddleware, createMessage);
router.patch("/messages/:chatId", authMiddleware, editMessage);
export default router;
