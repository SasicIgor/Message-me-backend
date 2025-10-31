import { Router } from "express";
import { login, register } from "../controllers/authController.ts";

const router = Router();

router.post("/register", register).post("/login", login);

export default router;
