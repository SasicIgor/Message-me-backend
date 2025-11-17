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

export const getOneChat = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
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
    if (!memberId || userId === memberId) {
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

export const updateChat = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
