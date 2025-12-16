import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/neon/connection.ts";
import { type Message, message } from "../db/neon/schema.ts";
import { BadRequestError } from "../errors/bad-request.error.ts";

export const messageService = {
  async getMessages(chatId: string): Promise<Message[]> {
    try {
      return await db.query.message.findMany({
        where: and(eq(message.chatId, chatId)),
        orderBy: [desc(message.createdAt)],
      });
    } catch (error) {
      throw error;
    }
  },

  async createMessage(
    chatId: string,
    senderId: string,
    content: string
  ): Promise<Message[]> {
    try {
      const msg = await db
        .insert(message)
        .values({ content, chatId, senderId })
        .returning();
      return msg;
    } catch (error) {
      throw error;
    }
  },

  async editMessage(
    chatId: string,
    senderId: string,
    messageId: string,
    content: string
  ): Promise<Message[]> {
    try {
      const result = await db
        .update(message)
        .set({ content })
        .where(
          and(
            eq(message.id, messageId),
            eq(message.senderId, senderId),
            eq(message.chatId, chatId)
          )
        )
        .returning();
      if (!result) throw new BadRequestError("No message to edit");
      return result;
    } catch (error) {
      throw error;
    }
  },

  async deleteMessage(
    chatId: string,
    senderId: string,
    messageId: string
  ): Promise<void> {
    try {
      await db
        .delete(message)
        .where(
          and(
            eq(message.chatId, chatId),
            eq(message.id, messageId),
            eq(message.senderId, senderId)
          )
        );
    } catch (error) {
      throw error;
    }
  },
};
