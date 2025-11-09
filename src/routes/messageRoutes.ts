import { Router } from "express";
import { authMiddleware } from "../middleware/auth.ts";
import { createMessage } from "../controllers/messageController.ts";

const router = Router();

router.post("/messages/:chatId", createMessage);

export default router;
