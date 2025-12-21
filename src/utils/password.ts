import "dotenv/config";
import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS || 12));
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return bcrypt.compare(password, hashedPassword);
};
