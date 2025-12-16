import type { NextFunction, Response } from "express";

import { type AuthenticatedRequest } from "../middleware/auth.middleware.ts";
import { getUserAndChat } from "../utils/getUserAndChat.ts";
import { messageService } from "./message.service.ts";
import { type Message } from "../db/neon/schema.ts";

export const getMessages = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = getUserAndChat(req);
    const msgs: Required<Message[]> = await messageService.getMessages(chatId);
    res.status(200).json({ message: "Success.", data:msgs });
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId, userId } = getUserAndChat(req);
    const { content } = req.body;
    const msg = await messageService.createMessage(chatId, userId, content);
    res.status(201).json({ message: "Message created", data:msg });
  } catch (error) {
    next(error);
  }
};
export const editMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId, userId, messageId } = getUserAndChat(req);
    const { content } = req.body;

    const msg = await messageService.editMessage(
      chatId,
      userId,
      messageId,
      content
    );
    res.status(200).json({ message: "Message updated", msg });
  } catch (error) {
    next(error);
  }
};
export const deleteMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId, userId, messageId } = getUserAndChat(req);
    await messageService.deleteMessage(chatId, userId, messageId);
    res.status(204);
  } catch (error) {
    next(error);
  }
};
