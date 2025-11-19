import type { NextFunction, Response } from "express";
import { type AuthenticatedRequest } from "../middleware/auth.middleware.ts";
import chatService from "./chat.service.ts";
import { BadRequestError } from "../errors/bad-request.error.ts";

export const getUserChats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.user!;
    const chats = await chatService.getAllChats(userId);
    res.status(200).json({ message: "Successfull", chats });
  } catch (error) {
    next(error);
  }
};

export const getOrCreatePrivateChat = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.user!;
    const { memberId } = req.body;
    if (userId === memberId) {
      throw new BadRequestError("Other member of chat is not provided!");
    }
    const result = await chatService.findOrCreatePrivateChat(userId, memberId);
    res.status(200).json({ message: "Success", result });
  } catch (error) {
    next(error);
  }
};

export const createGroupChat = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { memberIds, name } = req.body;
    const result = await chatService.createGroupChat(memberIds, name);
    res.status(200).json({ message: "Successfull chat creation", result });
  } catch (error) {
    next(error);
  }
};

export const updateChatName = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.user!;
    const { chatId } = req.params;
    const { name } = req.body;
    const result = await chatService.updateChatName(userId, chatId, name);
    res.status(201).json({ message: "Name updated successfully!", result });
  } catch (error) {
    next(error);
  }
};

export const updateChatMember = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId, username } = req.user!;
    const { chatId } = req.params;
    const { memberId } = req.body;
    const result = await chatService.updateChatMember(userId, chatId, memberId);
    res.status(201).json({ message: `${username} ${result.message}` });
  } catch (error) {
    next(error);
  }
};

export const deleteChat = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.user!;
    const { chatId } = req.params;
    await chatService.deleteChatForUser(userId, chatId);
    res.status(204);
  } catch (error) {
    next(error);
  }
};
