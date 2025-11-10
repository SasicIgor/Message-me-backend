import type { Request, Response } from "express";
import { db } from "../db/neon/connection.ts";
import { chat_member, message } from "../db/neon/schema.ts";
import { eq, and, desc, inArray } from "drizzle-orm";
import { AuthenticatedRequest } from "../middleware/auth.ts";

const isMember = async (userId: string, chatId: string): Promise<boolean> => {
  const member = await db.query.chat_member.findFirst({
    where: and(eq(chat_member.userId, userId), eq(chat_member.chatId, chatId)),
  });
  return member ? true : false;
};

export const getMessages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const checkMember = await isMember(req.user!.id, chatId);

    if (!checkMember) {
      res.status(403).json({ message: "Forbidden access!" });
    }

    const messages = await db.query.message.findMany({
      where: eq(message.chatId, chatId),
      orderBy: [desc(message.createdAt)],
    });

    res.status(200).json({ message: "All good baby.", messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createMessage = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { chatId } = req.params;
    if (!chatId) {
      return res.status(400).json({ message: "Bad request" });
    }
    const msg = await db
      .insert(message)
      .values({ ...req.body, chatId })
      .returning();
    res.status(201).json({ message: "Message created", msg });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const editMessage = (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
export const deleteMessage = (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
