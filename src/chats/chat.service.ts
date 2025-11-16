import { DrizzleQueryError, eq } from "drizzle-orm";
import { db } from "../db/neon/connection.ts";
import { chat_member } from "../db/neon/schema.ts";
import { type ChatInfo } from "./chat.types.ts";
import { DatabaseError } from "../errors/database.error.ts";

const chatService = {
  async getAllChats(userId: string): Promise<ChatInfo[]> {
    try {
      const chats = await db.query.chat_member.findMany({
        where: eq(chat_member.userId, userId),
        with: { chat: { with: { chatMembers: { with: { user: true } } } } },
      });

      const formatedData = chats.map((data) => {
        if (data.chat.isGroup) {
          return {
            chatId: data.chatId,
            name: data.chat.name,
            isGroup: data.chat.isGroup,
          };
        }
        const otherUser = data.chat.chatMembers.find(
          (m) => m.userId !== userId
        );
        if (!otherUser)
          throw new DatabaseError(
            "No other user found for a chat. Invalid key"
          );
        return {
          chatId: data.chatId,
          name: data.chat.name,
          isGroup: data.chat.isGroup,
          memberUsername: otherUser.user.username,
        };
      });
      return formatedData;
    } catch (error) {
      if (error instanceof DrizzleQueryError)
        throw new DatabaseError("Failed to query db!");
      throw error;
    }
  },

  async createChat() {},
  async updateChat() {},
  async deleteChat() {},
};

export default chatService;
