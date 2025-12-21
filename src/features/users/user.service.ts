import { eq, ilike } from "drizzle-orm";

import { db } from "#db/neon/connection.ts";
import { users, type User } from "#db/neon/schema.ts";

import { UnauthorizedError } from "#errors/unauthorized.error.ts";

export const userService = {
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
};
