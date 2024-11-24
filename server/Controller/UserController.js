import prisma from "../db/db.config.js";

export const createUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  const findUser = await prisma.user.findUnique({
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
      password,
      phone,
    },
  });

  return res.status(200).json({ data: newUser, msg: "User created." });
};

export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  await prisma.user.delete({
    where: {
      id: Number(userId),
    },
  });

  return res.json({ status: 200, msg: "User deleted successfully" });
};

export const fetchUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  return res.json({ status: 200, data: users });
}