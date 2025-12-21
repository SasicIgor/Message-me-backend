import { and, eq, ilike } from "drizzle-orm";
import { db } from "../db/neon/connection.ts";
import { refreshToken, users, type User } from "../db/neon/schema.ts";
import { UnauthorizedError } from "../errors/unauthorized.error.ts";
import { comparePassword } from "../utils/password.ts";

export const userService = {
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

  async getUserByUsername(
    name: string
  ): Promise<Pick<User, "username" | "id">[]> {
    try {
      const searchedUsers = await db
        .select({
          username: users.username,
          id: users.id,
        })
        .from(users)
        .where(ilike(users.username, `%${name}%`));
      return searchedUsers;
    } catch (error) {
      throw error;
    }
  },

  async updateUser(
    userId: string,
    data: Pick<User, "username" | "email">
  ): Promise<Pick<User, "username" | "id">> {
    try {
      const [updatedUser] = await db
        .update(users)
        .set(data)
        .where(eq(users.id, userId))
        .returning({ username: users.username, id: users.id });
      if (!updatedUser)
        throw new UnauthorizedError("No user edited. Unauthorized access!");
      return updatedUser;
    } catch (error) {
      throw error;
    }
  },

  async deleteUser(id: string) {
    try {
      await db.delete(users).where(eq(users.id, id)).returning();
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
