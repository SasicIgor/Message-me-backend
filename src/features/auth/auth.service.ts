import { eq } from "drizzle-orm";

import { db } from "#db/neon/connection.ts";
import { refreshToken, type User, users } from "#db/neon/schema.ts";

import { comparePassword } from "#utils/password.ts";
import { UnauthorizedError } from "#errors/unauthorized.error.ts";

export const authService = {
  async registerUser(
    data: Pick<User, "username" | "email" | "password">
  ): Promise<Pick<User, "id" | "username">> {
    try {
      const [newUser] = await db
        .insert(users)
        .values(data)
        .returning({ id: users.id, username: users.username });
      return newUser;
    } catch (error) {
      throw error;
    }
  },

  async loginUser(
    username: string,
    pass: string
  ): Promise<Pick<User, "id" | "username">> {
    try {
      const [{ password, ...storedUser }] = await db
        .select({
          id: users.id,
          username: users.username,
          password: users.password,
        })
        .from(users)
        .where(eq(users.username, username));
      if (!storedUser) {
        throw new UnauthorizedError("Invalid credentials!");
      }

      const isPassCorrect = await comparePassword(pass, password);

      if (!isPassCorrect) {
        throw new UnauthorizedError("Invalid credentials!");
      }
      return storedUser;
    } catch (error) {
      throw error;
    }
  },

  async storeRefreshToken(token: string, id: string) {
    try {
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const [storedToken] = await db
        .insert(refreshToken)
        .values({ expiresAt, userId: id, hashedToken: token })
        .returning();
      return storedToken;
    } catch (error) {
      throw error;
    }
  },
};
