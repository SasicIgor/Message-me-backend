import type { Request, Response } from "express";
import { db } from "../db/neon/index.ts";
import { users } from "../db/Neon/schema.ts";

export const register = async (req: Request, res: Response) => {
  try {
    const newUser = await db.insert(users).values(req.body).returning();
    return res
      .status(201)
      .json({ message: "New user created!", user: newUser });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req: Request, res: Response) => {
  const data = await db.query.users.findMany();
  console.log(data);
  res.status(200).json("Successfully logged in");
};
