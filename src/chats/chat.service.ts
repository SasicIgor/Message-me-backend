import { and, DrizzleQueryError, eq, inArray, ne, sql } from "drizzle-orm";
import { db } from "../db/neon/connection.ts";
import { chat, chat_member, user } from "../db/neon/schema.ts";
import type {
  SingleChatBasic,
  ChatBasicInfo,
  GroupChatBasicInfo,
} from "./chat.types.ts";
import { DatabaseError } from "../errors/database.error.ts";
import { BadRequestError } from "../errors/bad-request.error.ts";

const chatService = {
  async getAllChats(userId: string): Promise<ChatBasicInfo[]> {
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
          memberId: otherUser.user.id,
        };
      });
      return formatedData;
    } catch (error) {
      if (error instanceof DrizzleQueryError)
        throw new DatabaseError("Failed to query db!");
      throw error;
    }
  },
  async findOrCreatePrivateChat(
    userId: string,
    memberId: string
  ): Promise<SingleChatBasic> {
    //user is one who made request, memeber is other party of the 1v1 chat
    try {
      //find a member from the chat and throw error if it doesn't exist
      const [otherMember] = await db
        .select({ memberId: user.id, memberUsername: user.username })
        .from(user)
        .where(eq(user.id, memberId));
      if (!otherMember) throw new BadRequestError("Other user doesn't exist.");

      const membersId = [userId, memberId];

      //find the chat if it exist and return if you find it
      const [existingChat] = await db
        .select({ chatId: chat_member.chatId })
        .from(chat_member)
        .innerJoin(chat, eq(chat.id, chat_member.chatId))
        .where(
          and(eq(chat.isGroup, false), inArray(chat_member.userId, membersId))
        )
        .groupBy(chat_member.chatId)
        .having(sql`COUNT(*)=2`);
      if (existingChat) {
        return { ...otherMember, chatId: existingChat.chatId };
      }

      //create a new chat if there is no existing one\
      //transaction to encapsulte do logic for inserting in 2 tables
      const createdChat = await db.transaction(async (tx) => {
        const [newChat] = await tx
          .insert(chat)
          .values({ isGroup: false, name: null })
          .returning({ chatId: chat.id });

        await tx.insert(chat_member).values([
          { userId: membersId[0], chatId: newChat.chatId },
          { userId: membersId[1], chatId: newChat.chatId },
        ]);
        const data = { ...otherMember, ...newChat };
        return data;
      });

      return createdChat;
    } catch (error) {
      if (error instanceof DrizzleQueryError)
        throw new DatabaseError("Failed to query db!");
      throw error;
    }
  },
  async createGroupChat(
    memberIds: string[],
    name: string
  ): Promise<GroupChatBasicInfo> {
    try {
      const newGroupChat = await db.transaction(async (tx) => {
        const allUsersExist = await tx
          .select({ id: user.id })
          .from(user)
          .where(inArray(user.id, memberIds));
        console.log("ALL USERS: ", allUsersExist);

        if (allUsersExist.length !== memberIds.length) {
          throw new BadRequestError("All users must exist!");
        }

        const [newChat] = await tx
          .insert(chat)
          .values({ name, isGroup: true })
          .returning({
            chatId: chat.id,
            name: chat.name,
            isGroup: chat.isGroup,
          });
        console.log("NEW CHAT: ", newChat);
        if (!newChat) throw new DatabaseError("Failed to insert new chat");

        const chat_members = await tx
          .insert(chat_member)
          .values(
            memberIds.map((memberId) => {
              return { userId: memberId, chatId: newChat.chatId };
            })
          )
          .returning({ userId: chat_member.userId });

        console.log("CHAT MEMBERS: ", chat_members);

        if (chat_members.length !== memberIds.length)
          throw new DatabaseError(
            "Failed to insert all users to chat_members!"
          );
        return newChat;
      });
      console.log("NEW GROUP CHAT: ", newGroupChat);
      return newGroupChat;
    } catch (error) {
      if (error instanceof DrizzleQueryError) {
        throw new DatabaseError("Failed to query db!");
      }
      throw error;
    }
  },
  async deleteChat() {},
};

export default chatService;
