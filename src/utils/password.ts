import bcrypt from "bcrypt";
import "dotenv/config";

export const hashPassword = async (password: string) => {
  console.log(process.env.BCRYPT_ROUNDS);
  return bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS));
};
