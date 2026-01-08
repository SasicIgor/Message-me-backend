import "dotenv/config";
import { SignJWT, jwtVerify } from "jose";
import { createSecretKey } from "crypto";

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

export const verifyToken = async (
  token: string,
  type: "access" | "refresh"
): Promise<JWTPayload> => {
  const secret = type === "access" ? accessSecret() : refreshSecret();
  const { payload } = await jwtVerify(token, secret);
  return { id: payload.id as string, username: payload.username as string };
};
