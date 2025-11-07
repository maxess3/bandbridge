import prisma from "../db/db.config";
import { Request, Response } from "express";
import { NotFoundError, ForbiddenError } from "../errors";

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
    throw new ForbiddenError("Access denied");
  }

  const userId = req.params.id;
  await prisma.user.delete({
    where: {
      id: String(userId),
    },
  });

  res.status(200).json({ message: "User deleted successfully" });
};

export const fetchUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.status(200).json({ data: users });
};
