import type { NextFunction, Request, Response } from "express";
import { db } from "../db/neon/connection.ts";
import { user } from "../db/neon/schema.ts";
import { generateToken } from "../utils/jwt.ts";
import { comparePassword, hashPassword } from "../utils/password.ts";
import { eq } from "drizzle-orm";
import { UniqueConstraintError } from "../errors/unique-constarint.error.ts";
import { userService } from "./user.service.ts";
import { UnauthorizedError } from "../errors/unauthorized.error.ts";
import { type AuthenticatedRequest } from "../middleware/auth.middleware.ts";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, confirmedPassword, email } = req.body;
    const usernameExist = await db.query.user.findFirst({
      where: eq(user.username, username),
    });
    if (usernameExist) {
      throw new UniqueConstraintError("Username already exist!");
    }
    if (password !== confirmedPassword) {
      res.status(401).json("Password must be the same as confirmed password");
    }
    const hashedPassword = await hashPassword(password);

    const newUser = await userService.registerUser({
      username,
      password: hashedPassword,
      email,
    });

    const token = await generateToken({
      id: newUser.id,
      username: newUser.username,
    });

    res.status(201).json({ message: "New user created!", newUser, token });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    const storedUser = await userService.loginUser(username);

    const isPassCorrect = await comparePassword(password, storedUser.password);
    if (!isPassCorrect) {
      throw new UnauthorizedError("Invalid credentials!");
    }

    const token = await generateToken({ id: storedUser.id, username });

    res.status(200).json({
      message: "Successfully logged in",
      token,
      user: { username, id: storedUser.id },
    });
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
    const { id: userId } = req.user!;
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
    const { id: userId } = req.user!;
    console.log(userId);
    await userService.deleteUser(userId);
    res.status(204).json({ message: "User deleted successfully!" });
  } catch (error) {
    next(error);
  }
};
