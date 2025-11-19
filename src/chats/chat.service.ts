import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "../db/neon/connection.ts";
import { chat, chat_member, user } from "../db/neon/schema.ts";
import type {
  SingleChatBasic,
  ChatBasicInfo,
  GroupChatBasicInfo,
} from "./chat.types.ts";
import { DatabaseError } from "../errors/database.error.ts";
import { BadRequestError } from "../errors/bad-request.error.ts";
import { UnauthorizedError } from "../errors/unauthorized.error.ts";

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
            id: data.chatId,
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
          id: data.chatId,
          name: data.chat.name,
          isGroup: data.chat.isGroup,
          memberUsername: otherUser.user.username,
          memberId: otherUser.user.id,
        };
      });
      return formatedData;
    } catch (error) {
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
        return { ...otherMember, id: existingChat.chatId };
      }

      //create a new chat if there is no existing one\
      //transaction to encapsulte do logic for inserting in 2 tables
      const createdChat = await db.transaction(async (tx) => {
        const [newChat] = await tx
          .insert(chat)
          .values({ isGroup: false, name: null })
          .returning({ id: chat.id });

        await tx.insert(chat_member).values([
          { userId: membersId[0], chatId: newChat.id },
          { userId: membersId[1], chatId: newChat.id },
        ]);
        const data = { ...otherMember, ...newChat };
        return data;
      });

      return createdChat;
    } catch (error) {
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

        if (allUsersExist.length !== memberIds.length) {
          throw new BadRequestError("All users must exist!");
        }

        const [newChat] = await tx
          .insert(chat)
          .values({ name, isGroup: true })
          .returning({
            id: chat.id,
            name: chat.name,
            isGroup: chat.isGroup,
          });
        if (!newChat) throw new DatabaseError("Failed to insert new chat");

        const chat_members = await tx
          .insert(chat_member)
          .values(
            memberIds.map((memberId) => {
              return { userId: memberId, chatId: newChat.id };
            })
          )
          .returning({ userId: chat_member.userId });

        if (chat_members.length !== memberIds.length)
          throw new DatabaseError(
            "Failed to insert all users to chat_members!"
          );
        return newChat;
      });
      return newGroupChat;
    } catch (error) {
      throw error;
    }
  },
  async deleteChatForUser(userId: string, chatId: string): Promise<void> {
    try {
      const deletedChat = await db.transaction(async (tx) => {
        const isUserChatMember = await tx.query.chat_member.findFirst({
          where: and(
            eq(chat_member.chatId, chatId),
            eq(chat_member.userId, userId)
          ),
          with: { chat: true },
        });
        if (!isUserChatMember)
          throw new UnauthorizedError("Unauthorized access denied!");

        if (isUserChatMember.chat.isGroup) {
          await tx
            .delete(chat_member)
            .where(
              and(
                eq(chat_member.chatId, chatId),
                eq(chat_member.userId, userId)
              )
            );
          return;
        }
        await tx.delete(chat).where(eq(chat.id, chatId));
      });
    } catch (error) {
      throw error;
    }
  },
  async updateChatName(
    _userId: string,
    chatId: string,
    name: string
  ): Promise<ChatBasicInfo> {
    try { 
      const result = await db.transaction(async (tx) => {
        const [updatedChat] = await tx
          .update(chat)
          .set({ name })
          .where(eq(chat.id, chatId))
          .returning({ id: chat.id, isGroup: chat.isGroup, name: chat.name });
        return updatedChat;
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  async updateChatMember(
    userId: string,
    chatId: string,
    memberId: string
  ): Promise<{ message: string }> {
    //userId is one who sent request, memberId is person being added/removed
    //1. user adding another user
    //2. user removing another user
    //3. user removing himself
    try {
      const result = await db.transaction(async (tx) => {
        //check if member exist in user table
        const memberExist = await tx.query.user.findFirst({
          where: eq(user.id, memberId),
        });
        if (!memberExist)
          throw new BadRequestError("You cannot add/remove non existent user!");
        //check if user and member are the same for a message later
        const userAndMemberAreSame = userId === memberId;
        //in middleware we know that chat exists
        //now we check if its a group chat to allow the update of members
        const existingChat = await tx.query.chat.findFirst({
          where: and(eq(chat.id, chatId), eq(chat.isGroup, true)),
          with: { chatMembers: true },
        });
        if (!existingChat)
          throw new BadRequestError("You can't update private chat.");
        const alreadyMember = existingChat.chatMembers.find(
          (member) => member.userId === memberId
        );
        if (alreadyMember) {
          await tx
            .delete(chat_member)
            .where(
              and(
                eq(chat_member.chatId, chatId),
                eq(chat_member.userId, memberId)
              )
            );

          return {
            message: userAndMemberAreSame
              ? `left the group`
              : `removed ${memberExist.username} from group!`,
          };
        }
        await tx.insert(chat_member).values({ chatId, userId: memberId });
        return { message: ` has added ${memberExist.username} to group!` };
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
};

export default chatService;
