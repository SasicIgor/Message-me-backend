import type { NextFunction, Request, Response } from "express";

import { verifyToken, type JWTPayload } from "#utils/jwt.ts";
import { UnauthorizedError } from "#errors/unauthorized.error.ts";
//setting up an user in request
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
      return next(new UnauthorizedError("Unauthorised request!"));
    }

    const token = authHeaeder.split(" ")[1];

    if (!token) {
      return next(new UnauthorizedError("Token required!"));
    }

    const payload = await verifyToken(token, "access");
    if (!payload) return next(new UnauthorizedError("Invalid token!"));

    req.user = payload;
    next();
  } catch (error) {
    console.log("ERROR: ", error);
    return next(error);
  }
};
