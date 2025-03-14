import prisma from "../db/db.config";
import { Request, Response } from "express";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      res.status(401).json({ message: "Non authentifié" });
      return;
    }

    const updatedUser = await prisma.profile.update({
      where: { userId: userId },
      data: {
        firstName: req.body.firstname,
        username: req.body.username,
        birthDate: new Date(req.body.formattedBirthdate),
        gender: req.body.gender,
        country: req.body.country,
        zipCode: req.body.zipcode,
        city: req.body.city,
      },
      select: {
        firstName: true,
        username: true,
        birthDate: true,
        gender: true,
        country: true,
        zipCode: true,
        city: true,
      },
    });

    res.status(200).json({
      message: "Profil mis à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Une erreur est survenue lors de la mise à jour du profil",
    });
  }
};
