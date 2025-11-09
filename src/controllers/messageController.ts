import type { Request, Response } from "express";
import { db } from "../db/neon/connection.ts";
import { message } from "../db/neon/schema.ts";
import { eq, and, desc, inArray } from "drizzle-orm";

export const getMessages = (req: Request, res: Response) => {
  try {
  } catch (error) {}
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    if (!chatId) {
      return res.status(400).json({ message: "Bad request" });
    }
    const msg = await db
      .insert(message)
      .values({ ...req.body, chatId })
      .returning();
    res.status(201).json({ message: "Message created", msg });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const editMessage = (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
export const deleteMessage = (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
