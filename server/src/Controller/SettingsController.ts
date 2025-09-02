import prisma from "../db/db.config";
import { Request, Response } from "express";

export const getUserSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      res.status(401).json({ message: "Utilisateur non authentifié" });
      return;
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
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user settings:", error);
    res.status(500).json({
      message: "[Erreur] Impossible de récupérer les paramètres utilisateur",
    });
  }
};

export const updateUserSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      res.status(401).json({ message: "Utilisateur non authentifié" });
      return;
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true },
    });

    if (!currentUser) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    // Check if the username is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        username: req.body.username,
        id: { not: userId },
      },
    });

    if (existingUser) {
      res.status(400).json({
        message: "Le nom d'utilisateur est déjà pris",
      });
      return;
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

    // Fetch the updated user data
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
      message: "Vos informations ont été mises à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user settings:", error);
    res.status(500).json({
      message: "[Erreur] Mise à jour des informations impossible",
    });
  }
};
