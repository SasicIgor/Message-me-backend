import { and, eq } from "drizzle-orm";
import { db } from "../db/neon/connection.ts";
import { user, type User } from "../db/neon/schema.ts";
import { BadRequestError } from "../errors/bad-request.error.ts";
import { UnauthorizedError } from "../errors/unauthorized.error.ts";

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

  async loginUser(username: string): Promise<User> {
    try {
      const storedUser = await db.query.user.findFirst({
        where: eq(user.username, username),
      });
      if (!storedUser) {
        throw new UnauthorizedError("Invalid credentials!");
      }
      return storedUser;
    } catch (error) {
      throw error;
    }
  },

};
