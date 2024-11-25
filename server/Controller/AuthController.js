import prisma from "../db/db.config.js";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
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

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({ msg: "User does not exists." });
  }

  if (!compareSync(password, user.password)) {
    return res.status(400).json({ msg: "Incorrect password." });
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return res.status(200).json({ accessToken: accessToken });
};
