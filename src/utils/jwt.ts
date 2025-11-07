import { SignJWT } from "jose";
import { createSecretKey } from "crypto";
import "dotenv/config";

type JWTPayload = {
  id: string;
  username: string;
};

export const generateToken = (payload: JWTPayload) => {
  const secret = process.env.JWT_SECRET!;
  const secretKey = createSecretKey(secret, "utf-8");

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "3d")
    .sign(secretKey);
};
