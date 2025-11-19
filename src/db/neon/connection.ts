import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "./schema.ts";

const pool = new Pool({
  connectionString: process.env.NEON_DB_URL_TESTING as string,
});
export const db = drizzle(pool, { schema, logger: true });
