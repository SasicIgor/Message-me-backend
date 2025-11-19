import { db } from "../../src/db/neon/connection.ts";
import { chat, chat_member, message, user } from "../../src/db/neon/schema.ts";
import { sql } from "drizzle-orm";
import { execSync } from "child_process";
import "dotenv/config";

export default async function setup() {
  console.log("Setting up the test db!");
  try {
    await db.execute(sql`DROP TABLE IF EXISTS ${chat_member} CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS ${message} CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS ${chat} CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS ${user} CASCADE`);

    console.log("Pushing schema using drizzle!");

    execSync(
      `npx drizzle-kit push --url="${process.env.NEON_DB_URL_TESTING}" --schema="./src/db/neon/schema.ts" --dialect="postgresql"`,
      {
        stdio: "inherit",
        cwd: process.cwd(),
      }
    );
    console.log("Test DB created");
  } catch (error) {
    console.error("Fail to setup test db", error);
    throw error;
  }

  return async () => {
    try {
      await db.execute(sql`DROP TABLE IF EXISTS ${chat_member} CASCADE`);
      await db.execute(sql`DROP TABLE IF EXISTS ${message} CASCADE`);
      await db.execute(sql`DROP TABLE IF EXISTS ${chat} CASCADE`);
      await db.execute(sql`DROP TABLE IF EXISTS ${user} CASCADE`);
      process.exit(0);
    } catch (error) {
      console.error("Fail to clean test db", error);
      throw error;
    }
  };
}
