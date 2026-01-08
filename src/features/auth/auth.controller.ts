import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";

import { db } from "#db/neon/connection.ts";
import { users } from "#db/neon/schema.ts";

import { authService } from "./auth.service.ts";

import { UniqueConstraintError } from "#errors/unique-constarint.error.ts";
import { BadRequestError } from "#errors/bad-request.error.ts";

import { compareString, hashString } from "#utils/password.ts";
import { signAccessToken, signRefreshToken, verifyToken } from "#utils/jwt.ts";
import { UnauthorizedError } from "#errors/unauthorized.error.ts";

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
      throw new BadRequestError(
        "Password must be the same as confirmed password"
      );
    }
    const hashedPassword = await hashString(password);
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

    const hashedRefToken = await hashString(refreshToken);
    const { expiresAt } = await authService.storeRefreshToken(
      hashedRefToken,
      newUser.id
    );

    res
      .cookie("refreshToken", refreshToken, {
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

    const refreshToken = await signRefreshToken({
      id: storedUser.id,
      username: storedUser.username,
    });

    const hashedRefToken = await hashString(refreshToken);
    const { expiresAt } = await authService.storeRefreshToken(
      hashedRefToken,
      storedUser.id
    );

    const token = await signAccessToken({ id: storedUser.id, username });

    res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        expires: expiresAt,
        secure: true,
      })
      .json({
        message: "Successfully logged in",
        data: [{ user: storedUser, token }],
      });
  } catch (error) {
    next(error);
  }
};
//function that validates refresh token,
//rotates refresh token if expires in less than 2 days
//returns access and refresh token
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refToken = req.cookies.refreshToken;
    if (!refToken) {
      return res.status(200).json({
        message: "No cookie attached!",
        data: {
          user: null,
          accessToken: null,
        },
      });
    }

    const { id, username } = await verifyToken(refToken, "refresh");

    if (!id) {
      throw new UnauthorizedError("Invalid token sent!");
    }
    const { hashedToken, expiresAt } = await authService.getRefreshToken(id);

    const isValid = await compareString(refToken, hashedToken);

    if (!isValid) {
      throw new UnauthorizedError("Invalid token sent!");
    }

    const accessToken = await signAccessToken({ id, username });

    const today = new Date().getTime();
    const expDate = expiresAt.getTime();
    //2 days
    const twoDaysMs = 1000 * 60 * 60 * 24 * 2;
    const isLessThen2Days = expDate - today > twoDaysMs ? false : true;

    if (isLessThen2Days) {
      const newRefToken = await signRefreshToken({ id, username });
      const hashToken = await hashString(newRefToken);

      const { expiresAt } = await authService.storeRefreshToken(hashToken, id);

      return res
        .cookie("refreshToken", newRefToken, {
          httpOnly: true,
          sameSite: true,
          expires: expiresAt,
        })
        .status(200)
        .json({
          message: "Success",
          data: { token: accessToken, user: { username, id } },
        });
    }

    return res.status(200).json({
      message: "Success",
      data: { token: accessToken, user: { username, id } },
    });
  } catch (error) {
    next(error);
  }
};
