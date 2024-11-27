import prisma from "../db/db.config";
import { Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
      };
    }
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const currentUser = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
    select: {
      role: true,
    },
  });

  if (!currentUser || currentUser.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden access" });
  }

  const userId = req.params.id;
  await prisma.user.delete({
    where: {
      id: String(userId),
    },
  });

  return res.json({ status: 200, msg: "User deleted successfully" });
};

export const fetchUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  return res.json({ status: 200, data: users });
};

export const showUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await prisma.user.findFirst({
    where: {
      id: String(userId),
    },
  });

  return res.status(200).json({ data: user });
};
