import { Router } from "express";
import { authMiddleware } from "../middleware/auth.ts";

const router = Router();

router.get("/messages", authMiddleware, (req, res) => {
  res.status(201).json({ message: "something" });
});

export default router;
