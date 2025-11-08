import prisma from "../db/db.config";
import { Request, Response } from "express";
import { NotFoundError, UnauthorizedError, ValidationError } from "../errors";

/**
 * Retrieves the authenticated user's settings.
 *
 * @param req - Express request object with authenticated user
 * @param res - Express response object
 * @returns User settings (id, firstName, lastName, username, birthDate, gender)
 *
 * @throws {UnauthorizedError} If user is not authenticated
 * @throws {NotFoundError} If user is not found
 */
export const getUserSettings = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  if (!userId) {
    throw new UnauthorizedError("User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      birthDate: true,
      gender: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.status(200).json(user);
};

/**
 * Updates the authenticated user's settings.
 *
 * @param req - Express request object with authenticated user and updated settings in body
 * @param res - Express response object
 * @returns Updated user data and success message
 *
 * @throws {UnauthorizedError} If user is not authenticated
 * @throws {NotFoundError} If user is not found
 * @throws {ValidationError} If username is already taken by another user
 */
export const updateUserSettings = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  if (!userId) {
    throw new UnauthorizedError("User not authenticated");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true },
  });

  if (!currentUser) {
    throw new NotFoundError("User not found");
  }

  // Check if username is already taken by another user
  const existingUser = await prisma.user.findFirst({
    where: {
      username: req.body.username,
      id: { not: userId },
    },
  });

  if (existingUser) {
    throw new ValidationError("Username already taken");
  }

  // Convert birthdate from { day, month, year } to Date object
  let birthDate: Date | null = null;
  if (
    req.body.birthdate &&
    req.body.birthdate.day &&
    req.body.birthdate.month &&
    req.body.birthdate.year
  ) {
    const { day, month, year } = req.body.birthdate;
    birthDate = new Date(
      Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day))
    );
  }

  // Update user information
  await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      username: req.body.username,
      birthDate: birthDate,
      gender: req.body.gender,
    },
  });

  // Fetch updated user data
  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      birthDate: true,
      gender: true,
    },
  });

  res.status(200).json({
    message: "Information updated successfully",
    user: updatedUser,
  });
};
