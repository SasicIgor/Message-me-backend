import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/neon/connection.ts";
import { message } from "../db/neon/schema.ts";

export const messageService = {
  async getMessages(chatId: string) {
    return await db.query.message.findMany({
      where: and(eq(message.chatId, chatId)),
      orderBy: [desc(message.createdAt)],
    });
  },

  async createMessage(chatId: string, senderId: string, content: string) {
    const msg = await db
      .insert(message)
      .values({ content, chatId, senderId })
      .returning();
    return msg;
  },

  async editMessage(
    chatId: string,
    senderId: string,
    messageId: string,
    content: string
  ) {
    const msg = await db
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
    return msg;
  },

  async deleteMessage(chatId: string, senderId: string, messageId: string) {
    const msg = await db
      .delete(message)
      .where(
        and(
          eq(message.chatId, chatId),
          eq(message.id, messageId),
          eq(message.senderId, senderId)
        )
      )
      .returning();
    return msg;
  },
};
