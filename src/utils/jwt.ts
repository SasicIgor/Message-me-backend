import { SignJWT, jwtVerify } from "jose";
import { createSecretKey } from "crypto";
import "dotenv/config";

export type JWTPayload = {
  id: string;
  username: string;
};

const tokenSecret = () => {
  const secretKey = createSecretKey(process.env.JWT_SECRET!, "utf-8");
  return secretKey;
};

export const generateToken = (payload: JWTPayload) => {
  const secretKey = tokenSecret();

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "3d")
    .sign(secretKey);
};

export const verifyToken = async (token: string): Promise<JWTPayload> => {
  const secret = tokenSecret();
  const { payload } = await jwtVerify(token, secret);
  console.log(payload);
  return { id: payload.id as string, username: payload.username as string };
};
