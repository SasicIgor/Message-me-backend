import request from "supertest";
import app from "../src/server";
import { createTestUser, cleanupDatabase } from "./setup/dbHelpers";
import { afterEach, describe, expect, it } from "vitest";

describe("User Endpoints", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });
  describe("POST /api/v1/auth/user/register Integration Test", () => {
    it("should create a new user with valid data", async () => {
      const userData = {
        email: "igor@igor.com",
        password: "Test1234!",
        confirmedPassword: "Test1234!",
        username: "Igor",
      };
      const response = await request(app)
        .post("/api/v1/auth/user/register")
        .send(userData)
        .expect(201);
      expect(response.body).toHaveProperty("newUser");
      expect(response.body).toHaveProperty("token");
      expect(response.body.newUser).toHaveProperty("username");
      expect(response.body.newUser).toHaveProperty("id");
      expect(response.body.newUser).not.toHaveProperty("password");
    });
  });
});
