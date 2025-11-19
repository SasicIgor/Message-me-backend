import { describe, expect, test } from "vitest";
import { cleanupDatabase, createTestUser } from "./dbHelpers.ts";

describe("Test setup", () => {
  test("should connect to test db", async () => {
    const { testUser, token } = await createTestUser();
    expect(testUser).toBeDefined();
    await cleanupDatabase();
  });
});
