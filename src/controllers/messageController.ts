import type { Request, Response } from "express";
import { db } from "../db/neon/connection.ts";
import { message } from "../db/neon/schema.ts";
import { eq, and, desc, inArray } from "drizzle-orm";
import { type AuthenticatedRequest } from "../middleware/auth.ts";
import { getUserAndChat } from "../utils/getUserAndChat.ts";

export const getMessages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { chatId, userId } = getUserAndChat(req);

    const msgs = await db.query.message.findMany({
      where: and(eq(message.chatId, chatId), eq(message.senderId, userId)),
      orderBy: [desc(message.createdAt)],
    });

    return res.status(200).json({ message: "All good baby.", msgs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createMessage = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { chatId, userId } = getUserAndChat(req);

    const msg = await db
      .insert(message)
      .values({ ...req.body, chatId, senderId: userId })
      .returning();
    return res.status(201).json({ message: "Message created", msg });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const editMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { chatId, userId } = getUserAndChat(req);

    const { content, id } = req.body;

    const [msg] = await db
      .update(message)
      .set({ content })
      .where(
        and(
          eq(message.id, id),
          eq(message.chatId, chatId),
          eq(message.senderId, userId)
        )
      )
      .returning();
    if (!msg) {
      return res
        .status(403)
        .json({ message: "Bad request. No messasge to update" });
    }

    return res.status(201).json({ message: "Message updated", msg });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};
export const deleteMessage = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { chatId, userId } = getUserAndChat(req);
    const [msg] = await db
      .delete(message)
      .where(
        and(
          eq(message.id, req.body.id),
          eq(message.chatId, chatId),
          eq(message.senderId, userId)
        )
      )
      .returning();
    if (!msg) {
      return res
        .status(403)
        .json({ message: "Bad request. No messasge to delete" });
    }

    return res.status(201).json({ message: "Message deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};
