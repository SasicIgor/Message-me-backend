import type { NextFunction, Response } from "express";
import { type AuthenticatedRequest } from "../middleware/auth.middleware.ts";
import chatService from "./chat.service.ts";
import { BadRequestError } from "../errors/bad-request.error.ts";
import { getUserAndChat } from "../utils/getUserAndChat.ts";

export const getUserChats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = getUserAndChat(req);
    const result = await chatService.getAllChats(userId);
    res.status(200).json({ message: "Successfull", data:result });
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
    const { userId } = getUserAndChat(req);
    const { memberId } = req.body;
    if (userId === memberId) {
      throw new BadRequestError("Other member of chat is not provided!");
    }
    const result = await chatService.findOrCreatePrivateChat(userId, memberId);
    res.status(200).json({ message: "Success", data:result });
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
    const { userId } = getUserAndChat(req);
    const { memberIds, name } = req.body;
    const allMembers = [...memberIds, userId];
    const result = await chatService.createGroupChat(allMembers, name);
    res.status(200).json({ message: "Successfull chat creation", data:result });
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
    const { chatId, userId } = getUserAndChat(req);
    const { name } = req.body;
    const result = await chatService.updateChatName(userId, chatId, name);
    res.status(201).json({ message: "Name updated successfully!", data:result });
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
    const { chatId, userId, username } = getUserAndChat(req);
    const { memberId } = req.body;
    const result = await chatService.updateChatMember(userId, chatId, memberId);
    res.status(201).json({ message: `${username} ${result.message}`, data:result });
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
    const { chatId, userId } = getUserAndChat(req);
    await chatService.deleteChatForUser(userId, chatId);
    res.status(204);
  } catch (error) {
    next(error);
  }
};
