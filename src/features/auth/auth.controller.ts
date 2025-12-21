import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";

import { db } from "#db/neon/connection.ts";
import { users } from "#db/neon/schema.ts";

import { authService } from "./auth.service.ts";

import { UniqueConstraintError } from "#errors/unique-constarint.error.ts";

import { hashPassword } from "#utils/password.ts";
import { signAccessToken, signRefreshToken } from "#utils/jwt.ts";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, confirmedPassword, email } = req.body;
    const usernameExist = await db.query.users.findFirst({
      where: eq(users.username, username),
    });
    if (usernameExist) {
      throw new UniqueConstraintError("Username already exist!");
    }
    if (password !== confirmedPassword) {
      res.status(401).json("Password must be the same as confirmed password");
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await authService.registerUser({
      username,
      password: hashedPassword,
      email,
    });

    const accessToken = await signAccessToken({
      id: newUser.id,
      username: newUser.username,
    });

    const refreshToken = await signRefreshToken({
      id: newUser.id,
      username: newUser.username,
    });

    const hashedRefToken = await hashPassword(refreshToken);
    const { hashedToken, expiresAt } = await authService.storeRefreshToken(
      hashedRefToken,
      newUser.id
    );

    res
      .cookie("refreshToken", hashedToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: expiresAt,
      })
      .status(201)
      .json({
        message: "New user created!",
        data: [{ user: newUser, token: accessToken }],
      });
  } catch (error) {
    console.log("ERROR: ", error);
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
    const storedUser = await authService.loginUser(username, password);

    const token = await signAccessToken({ id: storedUser.id, username });

    res.status(200).json({
      message: "Successfully logged in",

      data: [{ user: storedUser, token }],
    });
  } catch (error) {
    next(error);
  }
};
