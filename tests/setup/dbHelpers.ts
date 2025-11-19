import { db } from "../../src/db/neon/connection.ts";
import {
  chat,
  chat_member,
  message,
  type User,
  user,
} from "../../src/db/neon/schema.ts";
import { generateToken } from "../../src/utils/jwt.ts";
import { hashPassword } from "../../src/utils/password.ts";

export const createTestUser = async (userData: Partial<User> = {}) => {
  const defaultData = {
    email: `test-${Date.now()}-${Math.random()}@example.com`,
    username: `testuser-${Date.now()}-${Math.random()}`,
    password: "Test123!",
    ...userData,
  };

  const hashedPass = await hashPassword(defaultData.password);
  const [testUser] = await db
    .insert(user)
    .values({ ...defaultData, password: hashedPass })
    .returning({ id: user.id, username: user.username });

  const token = generateToken({ id: testUser.id, username: testUser.username });

  return { token, testUser, rawPassword: defaultData.password };
};

export const cleanupDatabase = async () => {
  await db.delete(message);
  await db.delete(chat_member);
  await db.delete(chat);
  await db.delete(user);
};
