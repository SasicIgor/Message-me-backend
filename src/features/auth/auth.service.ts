import { and, eq } from "drizzle-orm";

import { db } from "#db/neon/connection.ts";
import { refreshToken, type User, users } from "#db/neon/schema.ts";

import { compareString } from "#utils/password.ts";
import { BadRequestError } from "#errors/bad-request.error.ts";

export const authService = {
  async registerUser(
    data: Pick<User, "username" | "email" | "password">,
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
    pass: string,
  ): Promise<Pick<User, "id" | "username">> {
    try {
      const [storedUser] = await db
        .select({
          id: users.id,
          username: users.username,
          password: users.password,
        })
        .from(users)
        .where(eq(users.username, username));

      if (!storedUser) {
        throw new BadRequestError("Invalid credentials!");
      }

      const { password, ...existingUserInfo } = storedUser;
      const isPassCorrect = await compareString(pass, password);

      if (!isPassCorrect) {
        throw new BadRequestError("Invalid credentials!");
      }
      return existingUserInfo;
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
        .onConflictDoUpdate({
          target: refreshToken.userId,
          set: {
            hashedToken: token,
            expiresAt,
          },
        })
        .returning();
      return storedToken;
    } catch (error) {
      console.log("token error:", error);
      throw error;
    }
  },

  async getRefreshToken(userId: string) {
    const [storedToken] = await db
      .select({
        hashedToken: refreshToken.hashedToken,
        expiresAt: refreshToken.expiresAt,
      })
      .from(refreshToken)
      .where(eq(refreshToken.userId, userId));
    console.log(storedToken);

    return storedToken;
  },
};
