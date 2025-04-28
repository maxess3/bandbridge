import prisma from "../db/db.config";
import { Request, Response } from "express";
import { Platform } from "@prisma/client";

export const getProfilePublic = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const profile = await prisma.profile.findUnique({
      where: {
        username: username,
      },
      select: {
        userId: true,
        firstName: true,
        username: true,
        birthDate: true,
        gender: true,
        country: true,
        zipCode: true,
        role: true,
        city: true,
        socialLinks: {
          select: {
            platform: true,
            url: true,
          },
        },
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
        followers: {
          take: 7,
          orderBy: {
            lastActiveAt: "desc",
          },
          select: {
            username: true,
            firstName: true,
            city: true,
            _count: {
              select: {
                followers: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      res.status(404).json({ message: "Profil introuvable" });
      return;
    }

    const formattedSocialLinks = Object.fromEntries(
      (profile.socialLinks || []).map(
        (link: { platform: string; url: string }) => [
          link.platform.toLowerCase(),
          link.url,
        ]
      )
    );

    const responseProfile = {
      ...profile,
      socialLinks: formattedSocialLinks,
      followers: profile._count?.followers || 0,
      following: profile._count?.following || 0,
      lastFollowers: (profile.followers || []).map(
        (follower: {
          username: string;
          firstName: string;
          city: string;
          _count: { followers: number };
        }) => ({
          username: follower.username,
          firstName: follower.firstName,
          city: follower.city,
          followersCount: follower._count.followers,
        })
      ),
    };

    res.status(200).json(responseProfile);
  } catch (error) {
    res.status(500).json({
      message: "[Erreur] Impossible de récupérer les données du profil",
    });
  }
};

export const getProfileOwner = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      res.status(401).json({ message: "[Erreur] Non authentifié" });
      return;
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: userId,
      },
      select: {
        userId: true,
        firstName: true,
        username: true,
        birthDate: true,
        gender: true,
        country: true,
        zipCode: true,
        role: true,
        city: true,
        socialLinks: {
          select: {
            platform: true,
            url: true,
          },
        },
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
        followers: {
          take: 7,
          orderBy: {
            lastActiveAt: "desc",
          },
          select: {
            username: true,
            firstName: true,
            city: true,
            _count: {
              select: {
                followers: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      res.status(404).json({ message: "Profil introuvable" });
      return;
    }

    const formattedSocialLinks = Object.fromEntries(
      (profile.socialLinks || []).map(
        (link: { platform: string; url: string }) => [
          link.platform.toLowerCase(),
          link.url,
        ]
      )
    );

    const responseProfile = {
      ...profile,
      socialLinks: formattedSocialLinks,
      followers: profile._count?.followers || 0,
      following: profile._count?.following || 0,
      lastFollowers: (profile.followers || []).map(
        (follower: {
          username: string;
          firstName: string;
          city: string;
          _count: { followers: number };
        }) => ({
          username: follower.username,
          firstName: follower.firstName,
          city: follower.city,
          followersCount: follower._count.followers,
        })
      ),
    };

    res.status(200).json(responseProfile);
  } catch (error) {
    res.status(500).json({
      message: "[Erreur] Impossible de récupérer les données du profil",
    });
  }
};

export const updateGeneralProfileOwner = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      res.status(401).json({ message: "[Erreur] Non authentifié" });
      return;
    }

    const currentProfile = await prisma.profile.findUnique({
      where: { userId: userId },
      select: { username: true },
    });

    // Check if the username is already taken
    if (currentProfile?.username !== req.body.username) {
      const existingProfile = await prisma.profile.findUnique({
        where: { username: req.body.username },
      });

      if (existingProfile) {
        res.status(400).json({
          message: "Le nom d'utilisateur est déjà pris",
        });
        return;
      }
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
      message: "Votre profil a bien été mis à jour",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "[Erreur] Mise à jour du profil impossible",
    });
  }
};

export const updateSocialProfileOwner = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      res.status(401).json({ message: "[Erreur] Non authentifié" });
      return;
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      res.status(404).json({ message: "[Erreur] Profil non trouvé" });
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
      message: "Vos liens sociaux ont bien été mis à jour",
      links: updatedLinks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "[Erreur] Mise à jour des liens sociaux impossible",
    });
  }
};

export const follow = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    const { targetUsername } = req.params;

    if (!userId) {
      res.status(401).json({ message: "[Erreur] Non authentifié" });
      return;
    }

    // Get the user profile
    const currentUserProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!currentUserProfile) {
      res.status(404).json({ message: "[Erreur] Profil non trouvé" });
      return;
    }

    // Get the target user profle
    const targetProfile = await prisma.profile.findUnique({
      where: { username: targetUsername },
    });

    if (!targetProfile) {
      res.status(404).json({ message: "[Erreur] Profil cible non trouvé" });
      return;
    }

    // Check if user profile is not the target profile
    if (currentUserProfile.id === targetProfile.id) {
      res
        .status(400)
        .json({ message: "[Erreur] Vous ne pouvez pas vous suivre vous-même" });
      return;
    }

    // Ajouter la relation de follow
    await prisma.profile.update({
      where: { id: currentUserProfile.id },
      data: {
        following: {
          connect: { id: targetProfile.id },
        },
      },
    });

    res.status(200).json({ message: "Profil suivi avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "[Erreur] Impossible de suivre ce profil",
    });
  }
};

export const unfollow = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    const { targetUsername } = req.params;

    if (!userId) {
      res.status(401).json({ message: "[Erreur] Non authentifié" });
      return;
    }

    // Get the user profile
    const currentUserProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!currentUserProfile) {
      res.status(404).json({ message: "[Erreur] Profil non trouvé" });
      return;
    }

    // Get the target user profle
    const targetProfile = await prisma.profile.findUnique({
      where: { username: targetUsername },
    });

    if (!targetProfile) {
      res.status(404).json({ message: "[Erreur] Profil cible non trouvé" });
      return;
    }

    // Delete profile relation
    await prisma.profile.update({
      where: { id: currentUserProfile.id },
      data: {
        following: {
          disconnect: { id: targetProfile.id },
        },
      },
    });

    res.status(200).json({ message: "Profil non suivi avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "[Erreur] Impossible d'arrêter de suivre ce profil",
    });
  }
};

export const isFollowing = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    const { targetUsername } = req.params;

    if (!userId) {
      res.status(401).json({ message: "[Erreur] Non authentifié" });
      return;
    }

    // Get the user profile with the following relation
    const currentUserProfile = await prisma.profile.findUnique({
      where: { userId },
      select: {
        id: true,
        following: {
          where: { username: targetUsername },
          select: { id: true },
        },
      },
    });

    if (!currentUserProfile) {
      res.status(404).json({ message: "[Erreur] Profil non trouvé" });
      return;
    }

    // Check if following relation exists
    const isFollowing = currentUserProfile.following.length > 0;

    res.status(200).json({
      isFollowing,
      targetUsername,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      message: "[Erreur] Impossible de vérifier le statut du follow",
    });
  }
};
