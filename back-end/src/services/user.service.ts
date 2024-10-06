import bcrypt from "bcryptjs";
import { Response } from "express";
import User from "../models/user.model";
import { generateTokenAndSetCookie } from "../utils/jwtUtils";

export async function loginService(
  username: string,
  password: string,
  res: Response,
) {
  const user = await User.findOne({
    where: { userName: username, isDeleted: false },
  });
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user?.passwordHash || "",
  );

  if (!user || !isPasswordCorrect) {
    return { success: false, user: undefined };
  }
  const token = generateTokenAndSetCookie(user.userName, res);
  return { success: true, user, token };
}
