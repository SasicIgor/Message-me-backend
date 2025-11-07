import type { Request, Response } from "express";
import { db } from "../db/neon/connection.ts";
import { user } from "../db/neon/schema.ts";
import { generateToken } from "../utils/jwt.ts";
import { hashPassword } from "../utils/password.ts";

export const register = async (req: Request, res: Response) => {
  try {
    const { password, confirmedPassword } = req.body;
    if (password !== confirmedPassword) {
      res.status(401).json("Password must be the same as confirmed password");
    }
    const hashedPassword = hashPassword(password);

    const [newUser] = await db
      .insert(user)
      .values({ ...req.body, password: hashedPassword })
      .returning({
        id: user.id,
        username: user.username,
      });

    console.log(newUser);

    const token = generateToken({ id: newUser.id, username: newUser.username });
    return res
      .status(201)
      .json({ message: "New user created!", newUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to create user");
  }
};

export const login = async (req: Request, res: Response) => {
  const data = await db.query.user.findMany();
  console.log(data);
  res.status(200).json("Successfully logged in");
};
