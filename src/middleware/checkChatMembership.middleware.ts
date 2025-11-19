import type { NextFunction, Response } from "express";
import { type AuthenticatedRequest } from "./auth.middleware.ts";
import { db } from "../db/neon/connection.ts";
import { and, eq } from "drizzle-orm";
import { chat_member } from "../db/neon/schema.ts";
import { UnauthorizedError } from "../errors/unauthorized.error.ts";
import { ServerError } from "../errors/server.error.ts";

const isMember = async (userId: string, chatId: string): Promise<boolean> => {
  const member = await db.query.chat_member.findFirst({
    where: and(eq(chat_member.userId, userId), eq(chat_member.chatId, chatId)),
  });
  return member ? true : false;
};

export const checkChatMembership = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { chatId } = req.params;

    const checkMember = await isMember(userId, chatId);
    if (!checkMember) {
      return next(new UnauthorizedError("You are not a chat member!"));
    }
    next();
  } catch (error) {
    return next(new ServerError("Server error!"));
  }
};
