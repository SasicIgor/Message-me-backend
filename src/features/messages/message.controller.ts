import type { NextFunction, Response } from "express";

import { messageService } from "./message.service.ts";

import { type Message } from "#db/neon/schema.ts";
import { type AuthenticatedRequest } from "#middleware/auth.middleware.ts";
import { getIO } from "#socket/socket.ts";
import { getUserAndChat } from "#utils/getUserAndChat.ts";

export const getMessages = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { chatId, userId } = getUserAndChat(req);
    const msgs: Required<Message[]> = await messageService.getMessages(
      chatId,
      userId,
    );
    res.status(200).json({ message: "Success.", data: msgs });
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { chatId, userId } = getUserAndChat(req);
    //get active chat users from socket
    //users that are online and have this chat open and didn't create this message
    const activeUserIds: string[] = (await getIO().in(chatId).fetchSockets())
      .map((s) => s.data.user.id)
      .filter((s) => s !== userId);

    const { msg, countUpdatedUserIds } = await messageService.createMessage(
      chatId,
      userId,
      req.body.content,
      activeUserIds,
    );

    getIO()
      //emit the message for active users (users that have this chat open)
      //and to the rest of the users in the chat that just got their count updated
      .to([...activeUserIds, ...countUpdatedUserIds])
      .emit("message:new", {
        msg,
      });
    //sender get's updated from the response
    res.status(201).json({ message: "Message created", data: msg });
  } catch (error) {
    next(error);
  }
};
export const editMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { chatId, userId, messageId } = getUserAndChat(req);
    const { content } = req.body;

    const msg = await messageService.editMessage(
      chatId,
      userId,
      messageId,
      content,
    );
    res.status(200).json({ message: "Message updated", data: msg });
  } catch (error) {
    next(error);
  }
};
export const deleteMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { chatId, userId, messageId } = getUserAndChat(req);
    await messageService.deleteMessage(chatId, userId, messageId);
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
