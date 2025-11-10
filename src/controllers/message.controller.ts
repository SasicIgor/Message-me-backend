import type { Response } from "express";

import { type AuthenticatedRequest } from "../middleware/auth.ts";
import { getUserAndChat } from "../utils/getUserAndChat.ts";
import { messageService } from "../services/message.service.ts";

export const getMessages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { chatId } = getUserAndChat(req);

    const msgs = await messageService.getMessages(chatId);

    return res.status(200).json({ message: "All good baby.", msgs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createMessage = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { chatId, userId } = getUserAndChat(req);
    const { content } = req.body;

    const msg = await messageService.createMessage(chatId, userId, content);
    return res.status(201).json({ message: "Message created", msg });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const editMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { chatId, userId } = getUserAndChat(req);

    const { content, id } = req.body;

    const msg = await messageService.editMessage(chatId, userId, id, content);
    if (!msg) {
      return res
        .status(403)
        .json({ message: "Bad request. No messasge to update" });
    }

    return res.status(201).json({ message: "Message updated", msg });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};
export const deleteMessage = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { chatId, userId } = getUserAndChat(req);
    const { id } = req.body;
    const msg = messageService.deleteMessage(chatId, userId, id);
    if (!msg) {
      return res
        .status(403)
        .json({ message: "Bad request. No messasge to delete" });
    }

    return res.status(201).json({ message: "Message deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};
