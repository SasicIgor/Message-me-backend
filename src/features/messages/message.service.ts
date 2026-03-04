import { and, asc, eq, notInArray, sql } from "drizzle-orm";

import { db } from "#db/neon/connection.ts";
import { chat, chat_member, type Message, message } from "#db/neon/schema.ts";

import { BadRequestError } from "#errors/bad-request.error.ts";

export const messageService = {
  async getMessages(chatId: string, userId: string): Promise<Message[]> {
    try {
      const msgs = await db.transaction(async (tx) => {
        const msgList = await tx
          .select({
            id: message.id,
            chatId: message.chatId,
            senderId: message.senderId,
            content: message.content,
            createdAt: message.createdAt,
          })
          .from(message)
          .where(eq(message.chatId, chatId))
          .orderBy(asc(message.createdAt));

        await tx
          .update(chat_member)
          .set({ unreadCount: 0 })
          .where(
            and(eq(chat_member.chatId, chatId), eq(chat_member.userId, userId)),
          );
        return msgList;
      });

      return msgs;
    } catch (error) {
      throw error;
    }
  },

  async createMessage(
    chatId: string,
    senderId: string,
    content: string,
    activeUsers: string[],
  ): Promise<{ msg: Message; countUpdatedUserIds: string[] }> {
    try {
      const newMsgData = db.transaction(async (tx) => {
        //create a new message in the chat
        const [msg] = await tx
          .insert(message)
          .values({ content, chatId, senderId })
          .returning();

        //update chat for interaction
        await tx
          .update(chat)
          .set({
            lastMessageId: msg.id,
            lastMessageSnippet: msg.content,
            lastUpdatedAt: sql`now()`,
          })
          .where(eq(chat.id, chatId));

        //update unreadCount for users that are offline
        //or currently looking other chat
        const users = await tx
          .update(chat_member)
          .set({ unreadCount: sql`${chat_member.unreadCount} + 1` })
          .where(
            and(
              eq(chat_member.chatId, chatId),
              notInArray(chat_member.userId, [...activeUsers, senderId]),
            ),
          )
          .returning({ memberId: chat_member.userId });
        const countUpdatedUserIds = users.map((u) => u.memberId);
        return { msg, countUpdatedUserIds };
      });

      return newMsgData;
    } catch (error) {
      throw error;
    }
  },

  async editMessage(
    chatId: string,
    senderId: string,
    messageId: string,
    content: string,
  ): Promise<Message> {
    try {
      const [result] = await db
        .update(message)
        .set({ content })
        .where(
          and(
            eq(message.id, messageId),
            eq(message.senderId, senderId),
            eq(message.chatId, chatId),
          ),
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
    messageId: string,
  ): Promise<void> {
    try {
      await db
        .delete(message)
        .where(
          and(
            eq(message.chatId, chatId),
            eq(message.id, messageId),
            eq(message.senderId, senderId),
          ),
        );
    } catch (error) {
      throw error;
    }
  },
};
