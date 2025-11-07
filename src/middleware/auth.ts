import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.ts";
import { type JWTPayload } from "jose";
interface AuthenticatedRequest extends Request {
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
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: "Forbidden access" });
  }
};
