import type { NextFunction, Request, Response } from "express";
import { db } from "../db/neon/connection.ts";
import { user } from "../db/neon/schema.ts";
import { generateToken } from "../utils/jwt.ts";
import { comparePassword, hashPassword } from "../utils/password.ts";
import { eq } from "drizzle-orm";
import { UniqueConstraintError } from "../errors/unique-constarint.error.ts";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, confirmedPassword } = req.body;
    const usernameExist = await db.query.user.findFirst({
      where: eq(user.username, username),
    });
    if (usernameExist) {
      throw new UniqueConstraintError("Username already in a database!");
    }
    if (password !== confirmedPassword) {
      res.status(401).json("Password must be the same as confirmed password");
    }
    const hashedPassword = await hashPassword(password);

    const [newUser] = await db
      .insert(user)
      .values({ ...req.body, password: hashedPassword })
      .returning({
        id: user.id,
        username: user.username,
      });

    const token = await generateToken({
      id: newUser.id,
      username: newUser.username,
    });

    return res
      .status(201)
      .json({ message: "New user created!", newUser, token });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    const [storedUser] = await db
      .select()
      .from(user)
      .where(eq(user.username, username))
      .limit(1);
    if (!storedUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // const isPassCorrect = await comparePassword(password, storedUser.password);
    // if (!isPassCorrect) {
    //   console.log(isPassCorrect);
    //   return res.status(401).json({ message: "Invalid credentials" });
    // }

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
