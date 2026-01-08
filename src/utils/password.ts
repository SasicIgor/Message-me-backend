import "dotenv/config";
import bcrypt from "bcrypt";

export const hashString = async (str: string) => {
  return bcrypt.hash(str, Number(process.env.BCRYPT_ROUNDS || 12));
};

export const compareString = async (
  str: string,
  hashedStr: string
) => {
  return bcrypt.compare(str, hashedStr);
};
