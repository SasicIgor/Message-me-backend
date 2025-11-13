import type { NextFunction, Response } from "express";

import { type AuthenticatedRequest } from "../middleware/auth.middleware.ts";
import { getUserAndChat } from "../utils/getUserAndChat.ts";
import { messageService } from "./message.service.ts";
import { BadRequestError } from "../errors/bad-request.error.ts";
import { type Message } from "../db/neon/schema.ts";

export const getMessages = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = getUserAndChat(req);
    const msgs: Required<Message[]> = await messageService.getMessages(chatId);
    res.status(200).json({ message: "All good baby.", msgs });
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
    const msg = (await messageService.createMessage(
      chatId,
      userId,
      content
    )) as Required<Message>;
    res.status(201).json({ message: "Message created", msg });
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

    if (!messageId) {
      throw new BadRequestError("Message Id is missing!");
    }

    const msg= (await messageService.editMessage(
      chatId,
      userId,
      messageId,
      content
    )) as Required<Message>;
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
    if (!messageId) {
      throw new BadRequestError("Message Id is missing!");
    }
    await messageService.deleteMessage(chatId, userId, messageId);
    res.status(204).json({ message: "Message deleted" });
  } catch (error) {
    next(error);
  }
};
