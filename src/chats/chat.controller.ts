import type { NextFunction, Response } from "express";
import { type AuthenticatedRequest } from "../middleware/auth.middleware.ts";
import chatService from "./chat.service.ts";

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
    const result = await chatService.findOrCreatePrivateChat(userId, memberId);
    res.status(200).json({ message: "Success", result });
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
