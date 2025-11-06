import { db } from "./connection.ts";
import { user, chat, chat_member, message } from "./schema.ts";
import { faker } from "@faker-js/faker";

const seed = async () => {
  console.log("Starting database seed...");

  try {
    console.log("Clearing existing data...");
    await db.delete(user);
    await db.delete(chat);
    await db.delete(chat_member);
    await db.delete(message);

    const userData = Array.from({ length: 10 }, (_, i) => ({
      username: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }));
    console.log("Inserting 10 users...");
  } catch (error) {
    console.log(error);
  }
};
seed();
