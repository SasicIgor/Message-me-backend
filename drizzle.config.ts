import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  schema: "./src/db/neon/schema.ts",
  out: "./src/db/neon/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEON_DB_URL_PRODUCITON as string,
  },
  verbose: true,
  strict: true,
});
