import type { NextFunction, Request, Response } from "express";
import { verifyToken, type JWTPayload } from "../utils/jwt.ts";

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeaeder =
      (req.headers["Authorization"] as string) ||
      (req.headers["authorization"] as string);
    if (!authHeaeder) {
      return next("Forbidden access!");
    }

    const token = authHeaeder.split(" ")[1];

    if (!token) {
      return next("Forbidden access!");
    }

    const payload = await verifyToken(token);
    if (!payload) return res.status(401).json({ message: "Invalid token" });

    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: "Forbidden access" });
  }
};
