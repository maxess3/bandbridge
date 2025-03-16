import prisma from "../db/db.config";
import { Request, Response } from "express";
import { Platform } from "@prisma/client";

export const updateGeneralProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      res.status(401).json({ message: "[Erreur]: Non authentifié" });
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
      message: "Profil mis à jour avec succès.",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "[Erreur] Mise à jour du profil impossible.",
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      res.status(401).json({ message: "[Erreur]: Non authentifié" });
      return;
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: userId },
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

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      message: "[Erreur] Impossible de récupérer les données du profil.",
    });
  }
};

export const updateSocialLinks = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      res.status(401).json({ message: "[Erreur]: Non authentifié" });
      return;
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      res.status(404).json({ message: "[Erreur]: Profil non trouvé" });
      return;
    }

    await prisma.socialLink.deleteMany({
      where: { profileId: profile.id },
    });

    const socialLinks = [];
    const platforms: Record<string, Platform> = {
      youtube: Platform.YOUTUBE,
      instagram: Platform.INSTAGRAM,
      tiktok: Platform.TIKTOK,
      twitter: Platform.TWITTER,
      soundcloud: Platform.SOUNDCLOUD,
    };

    for (const [key, platform] of Object.entries(platforms)) {
      if (req.body[key]) {
        socialLinks.push({
          platform,
          url: req.body[key],
          profileId: profile.id,
        });
      }
    }

    const updatedLinks = await prisma.socialLink.createMany({
      data: socialLinks,
    });

    res.status(200).json({
      message: "Liens sociaux mis à jour avec succès",
      links: updatedLinks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "[Erreur] Mise à jour des liens sociaux impossible",
    });
  }
};
