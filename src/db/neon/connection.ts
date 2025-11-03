import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema.ts";

const sql = neon(process.env.NEON_DB_URL as string);
export const db = drizzle(sql, { schema });
