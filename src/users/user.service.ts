import { and, eq } from "drizzle-orm";
import { db } from "../db/neon/connection.ts";
import { user, type User } from "../db/neon/schema.ts";
import { UnauthorizedError } from "../errors/unauthorized.error.ts";
import { comparePassword } from "../utils/password.ts";

export const userService = {
  async registerUser(
    data: Pick<User, "username" | "email" | "password">
  ): Promise<Pick<User, "id" | "username">> {
    try {
      const [newUser] = await db
        .insert(user)
        .values(data)
        .returning({ id: user.id, username: user.username });
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
          id: user.id,
          username: user.username,
          password: user.password,
        })
        .from(user)
        .where(eq(user.username, username));
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

  async updateUser(
    userId: string,
    data: Pick<User, "username" | "email">
  ): Promise<Pick<User, "username" | "id">> {
    try {
      const [updatedUser] = await db
        .update(user)
        .set(data)
        .where(eq(user.id, userId))
        .returning({ username: user.username, id: user.id });
      if (!updatedUser)
        throw new UnauthorizedError("No user edited. Unauthorized access!");
      return updatedUser;
    } catch (error) {
      throw error;
    }
  },

  async deleteUser(id: string) {
    try {
      await db.delete(user).where(eq(user.id, id)).returning();
    } catch (error) {
      throw error;
    }
  },
};
