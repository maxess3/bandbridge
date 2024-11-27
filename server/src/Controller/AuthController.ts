import prisma from "../db/db.config";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

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

  return res.status(200).json({ data: newUser, msg: "User created." });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

  if (!user) {
    return res.status(400).json({ msg: "User does not exists." });
  }

  if (!ACCESS_TOKEN_SECRET) {
    return res.status(500).json({
      msg: "Server configuration error: Missing authentication secrets",
    });
  }

  if (!REFRESH_TOKEN_SECRET) {
    return res.status(500).json({
      msg: "Server configuration error: Missing authentication secrets",
    });
  }

  if (!compareSync(password, user.password)) {
    return res.status(400).json({ msg: "Incorrect password." });
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
    },
    REFRESH_TOKEN_SECRET
  );

  return res
    .status(200)
    .json({ accessToken: accessToken, refreshToken: refreshToken });
};
