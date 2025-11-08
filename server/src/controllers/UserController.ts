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

/**
 * Deletes a user by ID.
 * Requires ADMIN role.
 *
 * @param req - Express request object with user ID in params
 * @param res - Express response object
 * @returns Success message
 *
 * @throws {ForbiddenError} If user is not an admin
 * @throws {NotFoundError} If user to delete is not found
 */
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

/**
 * Fetches all users.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns Array of all users
 */
export const fetchUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.status(200).json({ data: users });
};
