import * as bcrypt from "bcrypt";

export function enCodePassword(rawPassword: string) {
  const SALT = bcrypt.genSaltSync();
  const hashedPassword = bcrypt.hashSync(rawPassword, SALT);
  return hashedPassword;
}
