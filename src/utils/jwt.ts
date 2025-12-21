import { SignJWT, jwtVerify } from "jose";
import type { Response } from "express";
import { createSecretKey } from "crypto";
import "dotenv/config";
import { hashPassword as hashString } from "./password.ts";
import { db } from "../db/neon/connection.ts";
import { refreshToken } from "../db/neon/schema.ts";
export type JWTPayload = {
  id: string;
  username: string;
};
const refExpires = 60 * 60 * 24 * 7; //7 days

const accessSecret = () => {
  return createSecretKey(process.env.JWT_SECRET!, "utf-8");
};

const refreshSecret = () => {
  return createSecretKey(process.env.JWT_REFRESH_SECRET!, "utf-8");
};

export const signAccessToken = (payload: JWTPayload) => {
  const secretKey = accessSecret();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(secretKey);
};
export const signRefreshToken = (payload: JWTPayload) => {
  const secretKey = refreshSecret();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
};
export const storeRefToken = async (token: string, userId: string) => {
  const hashedToken = await hashString(token);
  
};

export const verifyToken = async (token: string): Promise<JWTPayload> => {
  const secret = accessSecret();
  const { payload } = await jwtVerify(token, secret);
  console.log(payload);
  return { id: payload.id as string, username: payload.username as string };
};
