import bcrypt from "bcryptjs";

export const hashPassword = async (pass: string) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(pass, salt);
};

export async function checkPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
