import prisma from "../db/db.config";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { generateAccessToken } from "../utils/utils";

export const signup = async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;

  const findUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (findUser) {
    return res
      .status(400)
      .json({ message: "Email already exists, please use another one" });
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10),
      phone,
    },
  });

  return res.status(200).json({ data: newUser, message: "User created." });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "User does not exists." });
  }

  if (!compareSync(password, user.password)) {
    return res.status(400).json({ message: "Incorrect password." });
  }

  const userId = user.id;
  const accessToken = generateAccessToken(userId);

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ token: accessToken });
};

export const refresh = (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.sendStatus(403);
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err: Error | null, user: any) => {
      if (err) return res.sendStatus(403);
      const userId = user.userId;
      const accessToken = generateAccessToken(userId);
      return res.status(200).json({ token: accessToken });
    }
  );
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
