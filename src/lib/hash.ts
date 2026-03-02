import bcrypt from "bcryptjs";

export const hashPassword = async (pass: string) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(pass, salt);
};
