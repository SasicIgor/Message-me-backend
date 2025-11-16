import { db } from "./connection.ts";
import {
  user,
  chat,
  chat_member,
  message,
  type ChatMember,
  type Message,
} from "./schema.ts";
import { faker } from "@faker-js/faker";

const seed = async () => {
  console.log("Starting database seed...");

  try {
    console.log("Clearing existing data...");
    await db.delete(message);
    await db.delete(chat_member);
    await db.delete(chat);
    await db.delete(user);

    //=====INSERTING USERS=====

    const userData = Array.from({ length: 10 }, (_, i) => ({
      username: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }));

    userData.forEach((user) => {
      console.log("Username: ", user.username, "  Password: ", user.password);
    });
    console.log("Inserting 10 users...");
    const insertedUsers = await db
      .insert(user)
      .values(userData)
      .returning({ id: user.id });
    const usersId = insertedUsers.map((u) => u.id);

    //=====INSERTING CHATS=====

    console.log("Inserting 10 chats...");
    const chatData = [
      { name: null, isGroup: false },
      { name: null, isGroup: false },
      { name: null, isGroup: false },
      { name: "Birthday party", isGroup: true },
      { name: "Study group", isGroup: true },
    ];
    //index 3 and 4 are group chats
    const insertedChats = await db
      .insert(chat)
      .values(chatData)
      .returning({ id: chat.id });
    const chatsId = insertedChats.map((c) => c.id);

    //===== INSERTING CHAT MEMBERS =====

    console.log("Inserting chat members...");
    const chatMembers: ChatMember[] = [];
    //1v1 chat_members
    for (let i = 0; i < 3; i += 2) {
      let chatIndex = i / 2;
      chatMembers.push({
        userId: usersId[i],
        chatId: chatsId[chatIndex],
      });
      chatMembers.push({
        userId: usersId[i + 1],
        chatId: chatsId[chatIndex],
      });
    }
    //inserting users to the group chats
    for (let i = 0; i < 10; i++) {
      const chatIndex = i >= 5 ? 3 : 4;
      chatMembers.push({
        userId: usersId[i],
        chatId: chatsId[chatIndex],
      });
    }
    await db.insert(chat_member).values(chatMembers).returning();

    //===== INSERTING MESSAGES =====

    console.log("Creating messages");
    const messageData: Message[] = [];
    for (const member of chatMembers) {
      messageData.push({
        chatId: member.chatId,
        senderId: member.userId,
        content: faker.lorem.sentence(),
      });
    }
    console.log("Inserting messages to db...");
    await db.insert(message).values(messageData);

    console.log("It's done!");
  } catch (error) {
    console.log(error);
  }
};
seed();
