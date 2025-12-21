import type { NextFunction, Response } from "express";

import { userService } from "./user.service.ts";

import { type AuthenticatedRequest } from "#middleware/auth.middleware.ts";
import { getUserAndChat } from "#utils/getUserAndChat.ts";

export const findByUsername = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.params;
    console.log(username);
    const searchedUsers = await userService.getUserByUsername(username);
    res.status(200).json({ message: "Success", data: searchedUsers });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = getUserAndChat(req);
    const newData = req.body;

    const updatedUser = await userService.updateUser(userId, newData);
    res
      .status(200)
      .json({ message: "User successfully updated!", data: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = getUserAndChat(req);
    await userService.deleteUser(userId);
    res.status(204);
  } catch (error) {
    next(error);
  }
};
