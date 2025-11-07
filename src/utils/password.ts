import bcrypt from "bcrypt";
import "dotenv/config";

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, process.env.BCRYPT_ROUNDS!);
};
