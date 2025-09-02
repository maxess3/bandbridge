import prisma from "../db/db.config";
import { Request, Response } from "express";
import { Platform } from "@prisma/client";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import { calculateAge } from "../utils/utils";

export const getProfilePublic = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        Profile: {
          select: {
            id: true,
            userId: true,
            pseudonyme: true,
            role: true,
            description: true,
            concertsPlayed: true,
            rehearsalsPerWeek: true,
            practiceType: true,
            isLookingForBand: true,
            genres: true,
            profilePictureKey: true,
            lastActiveAt: true,
            country: true,
            city: true,
            departmentName: true,
            zipCode: true,
            socialLinks: {
              select: {
                platform: true,
                url: true,
              },
            },
            instruments: {
              select: {
                instrumentTypeId: true,
                level: true,
                order: true,
                instrumentType: {
                  select: {
                    name: true,
                    profession: true,
                  },
                },
              },
              orderBy: {
                order: "asc",
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
                pseudonyme: true,
                profilePictureKey: true,
                lastActiveAt: true,
                city: true,
                user: {
                  select: {
                    username: true,
                  },
                },
                _count: {
                  select: {
                    followers: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.Profile) {
      res.status(404).json({ message: "Profil introuvable" });
      return;
    }

    const profile = user.Profile;

    const age = calculateAge(user.birthDate);

    const formattedSocialLinks = Object.fromEntries(
      (profile.socialLinks || []).map(
        (link: { platform: string; url: string }) => [
          link.platform.toLowerCase(),
          link.url,
        ]
      )
    );

    const responseProfile = {
      userId: profile.userId,
      username: user.username,
      pseudonyme: profile.pseudonyme,
      age: age,
      country: profile.country,
      zipCode: profile.zipCode,
      city: profile.city,
      departmentName: profile.departmentName,
      role: profile.role,
      description: profile.description,
      concertsPlayed: profile.concertsPlayed,
      rehearsalsPerWeek: profile.rehearsalsPerWeek,
      practiceType: profile.practiceType,
      isLookingForBand: profile.isLookingForBand,
      genres: profile.genres,
      instruments: profile.instruments,
      profilePictureKey: profile.profilePictureKey,
      lastActiveAt: profile.lastActiveAt,
      createdAt: user.created_at,
      socialLinks: formattedSocialLinks,
      followers: profile._count?.followers || 0,
      following: profile._count?.following || 0,
      lastFollowers: (profile.followers || []).map(
        (follower: {
          pseudonyme: string;
          profilePictureKey: string | null;
          lastActiveAt: Date | null;
          city: string | null;
          user: {
            username: string;
          };
          _count: { followers: number };
        }) => ({
          pseudonyme: follower.pseudonyme,
          username: follower.user.username,
          profilePictureKey: follower.profilePictureKey,
          lastActiveAt: follower.lastActiveAt,
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
      res.status(401).json({ message: "Utilisateur non authentifié" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        Profile: {
          select: {
            id: true,
            userId: true,
            pseudonyme: true,
            role: true,
            description: true,
            concertsPlayed: true,
            rehearsalsPerWeek: true,
            practiceType: true,
            isLookingForBand: true,
            genres: true,
            profilePictureKey: true,
            lastActiveAt: true,
            country: true,
            city: true,
            zipCode: true,
            departmentName: true,
            socialLinks: {
              select: {
                platform: true,
                url: true,
              },
            },
            instruments: {
              select: {
                instrumentTypeId: true,
                level: true,
                order: true,
                instrumentType: {
                  select: {
                    name: true,
                    profession: true,
                  },
                },
              },
              orderBy: {
                order: "asc",
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
                pseudonyme: true,
                profilePictureKey: true,
                lastActiveAt: true,
                city: true,
                user: {
                  select: {
                    username: true,
                  },
                },
                _count: {
                  select: {
                    followers: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.Profile) {
      res.status(404).json({ message: "Profil introuvable" });
      return;
    }

    const profile = user.Profile;

    const age = calculateAge(user.birthDate);

    const formattedSocialLinks = Object.fromEntries(
      (profile.socialLinks || []).map(
        (link: { platform: string; url: string }) => [
          link.platform.toLowerCase(),
          link.url,
        ]
      )
    );

    const responseProfile = {
      userId: profile.userId,
      username: user.username,
      pseudonyme: profile.pseudonyme,
      age: age,
      country: profile.country,
      zipCode: profile.zipCode,
      city: profile.city,
      departmentName: profile.departmentName,
      role: profile.role,
      description: profile.description,
      concertsPlayed: profile.concertsPlayed,
      rehearsalsPerWeek: profile.rehearsalsPerWeek,
      practiceType: profile.practiceType,
      isLookingForBand: profile.isLookingForBand,
      genres: profile.genres,
      instruments: profile.instruments,
      profilePictureKey: profile.profilePictureKey,
      lastActiveAt: profile.lastActiveAt,
      createdAt: user.created_at,
      socialLinks: formattedSocialLinks,
      followers: profile._count?.followers || 0,
      following: profile._count?.following || 0,
      lastFollowers: (profile.followers || []).map(
        (follower: {
          pseudonyme: string;
          profilePictureKey: string | null;
          lastActiveAt: Date | null;
          city: string | null;
          user: {
            username: string;
          };
          _count: { followers: number };
        }) => ({
          pseudonyme: follower.pseudonyme,
          username: follower.user.username,
          profilePictureKey: follower.profilePictureKey,
          lastActiveAt: follower.lastActiveAt,
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
      res.status(401).json({ message: "Utilisateur non authentifié" });
      return;
    }

    const currentProfile = await prisma.profile.findUnique({
      where: { userId: userId },
      select: {
        id: true,
        country: true,
        zipCode: true,
        city: true,
        departmentName: true,
      },
    });

    if (!currentProfile) {
      res.status(404).json({ message: "Profil non trouvé" });
      return;
    }

    // Update profile genres
    await prisma.profile.update({
      where: { userId: userId },
      data: {
        genres: req.body.genres,
      },
    });

    // Handle instruments if provided
    if (req.body.instruments && Array.isArray(req.body.instruments)) {
      // Delete existing instruments
      await prisma.instrument.deleteMany({
        where: { profileId: currentProfile.id },
      });

      // Add new instruments if any
      if (req.body.instruments.length > 0) {
        const instrumentsData = req.body.instruments.map(
          (instrument: any, index: number) => ({
            instrumentTypeId: instrument.instrumentTypeId,
            level: instrument.level,
            order: instrument.order ?? index, // Use provided order or default to index
            profileId: currentProfile.id,
          })
        );

        await prisma.instrument.createMany({
          data: instrumentsData,
        });
      }
    }

    const hasLocationChanged =
      currentProfile.country !== req.body.country ||
      currentProfile.zipCode !== req.body.zipcode ||
      currentProfile.city !== req.body.city;

    let departmentName = currentProfile.departmentName;

    if (req.body.country === "France" && req.body.zipcode && req.body.city) {
      if (hasLocationChanged) {
        try {
          const response = await fetch(
            `https://geo.api.gouv.fr/communes?codePostal=${req.body.zipcode}&fields=departement`
          );

          if (response.ok) {
            const data = await response.json();

            // Vérifier que la ville existe pour ce code postal
            const validCities = data.map((c: any) => c.nom);
            if (!validCities.includes(req.body.city)) {
              res.status(400).json({
                message: "La ville ne correspond pas au code postal saisi",
              });
              return;
            }

            // Récupérer le nom du département
            departmentName = data[0]?.departement?.nom;
          } else {
            console.error(
              `Erreur API: ${response.status} ${response.statusText}`
            );
          }
        } catch (error) {
          console.error("Erreur lors de la validation de l'adresse:", error);
        }
      }
    }

    // Update profile location information
    await prisma.profile.update({
      where: { userId: userId },
      data: {
        pseudonyme: req.body.pseudonyme,
        country: req.body.country,
        zipCode: req.body.zipcode,
        city: req.body.city,
        departmentName: departmentName,
      },
    });

    // Fetch the final updated data
    const updatedProfile = await prisma.profile.findUnique({
      where: { userId: userId },
      select: {
        pseudonyme: true,
        country: true,
        zipCode: true,
        city: true,
        departmentName: true,
        genres: true,
        instruments: {
          select: {
            id: true,
            level: true,
            order: true,
            instrumentType: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    res.status(200).json({
      message: "Votre profil a bien été mis à jour",
      user: {
        pseudonyme: updatedProfile?.pseudonyme,
        country: updatedProfile?.country,
        zipCode: updatedProfile?.zipCode,
        city: updatedProfile?.city,
        departmentName: updatedProfile?.departmentName,
        genres: updatedProfile?.genres,
        instruments: updatedProfile?.instruments,
      },
    });
  } catch (error) {
    console.error("Error updating general profile:", error);
    res.status(500).json({
      message: "[Erreur] Mise à jour du profil impossible",
    });
  }
};

export const updateInfoProfileOwner = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      res.status(401).json({ message: "Utilisateur non authentifié" });
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

    // Update description, concerts played, rehearsals per week and practice type
    await prisma.profile.update({
      where: { userId },
      data: {
        description: req.body.description || null,
        concertsPlayed: req.body.concertsPlayed || "NOT_SPECIFIED",
        rehearsalsPerWeek: req.body.rehearsalsPerWeek || "NOT_SPECIFIED",
        practiceType: req.body.practiceType || "NOT_SPECIFIED",
        isLookingForBand: req.body.isLookingForBand ?? false,
      },
    });

    // Update social links
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

    // Get updated profile data
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
      },
    });

    const updatedProfile = await prisma.profile.findUnique({
      where: { userId },
      select: {
        description: true,
        concertsPlayed: true,
        rehearsalsPerWeek: true,
        practiceType: true,
        isLookingForBand: true,
      },
    });

    res.status(200).json({
      message: "Vos informations ont bien été mises à jour",
      user: {
        ...updatedUser,
        ...updatedProfile,
      },
      links: updatedLinks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "[Erreur] Mise à jour des informations impossible",
    });
  }
};

export const uploadProfilePicture = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      res.status(401).json({ message: "Utilisateur non authentifié" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: "Aucun fichier n'a été uploadé" });
      return;
    }

    const file = req.file;
    const uuid = uuidv4();
    const r2 = new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });

    // Define the desired image sizes
    const sizes = {
      thumbnail: 44,
      small: 80,
      medium: 224,
      large: 400,
    };

    const currentProfile = await prisma.profile.findUnique({
      where: { userId },
      select: { profilePictureKey: true },
    });

    // Delete the old images if they exist
    if (currentProfile?.profilePictureKey) {
      const oldKey = currentProfile.profilePictureKey;
      const oldKeyBase = oldKey.substring(0, oldKey.lastIndexOf("-"));

      const deletePromises = Object.keys(sizes).map(async (size) => {
        const keyToDelete = `${oldKeyBase}-${size}.webp`;
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: keyToDelete,
        });
        try {
          await r2.send(deleteCommand);
        } catch (error) {
          console.error(
            `Erreur lors de la suppression de ${keyToDelete}:`,
            error
          );
        }
      });
      await Promise.all(deletePromises);
    }

    const uploadPromises = Object.entries(sizes).map(async ([size, width]) => {
      const resizedImage = await sharp(file.buffer)
        .resize(width, width, {
          fit: "cover",
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toBuffer();

      const key = `profile-pictures/${userId}/${uuid}-${size}.webp`;

      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: resizedImage,
        ContentType: "image/webp",
      });

      await r2.send(command);
      return { size, key };
    });

    const uploadedImages = await Promise.all(uploadPromises);

    // Update profile with the main image key
    const mainImageKey = uploadedImages.find(
      (img) => img.size === "medium"
    )?.key;
    if (mainImageKey) {
      await prisma.profile.update({
        where: { userId },
        data: { profilePictureKey: mainImageKey },
      });
    }

    res.status(200).json({
      message: "Photo de profil mise à jour",
      user: {
        profilePictureKey: mainImageKey,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'upload des images" });
  }
};

export const deleteProfilePicture = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      res.status(401).json({ message: "Utilisateur non authentifié" });
      return;
    }

    const currentProfile = await prisma.profile.findUnique({
      where: { userId },
      select: { profilePictureKey: true },
    });

    if (!currentProfile?.profilePictureKey) {
      res.status(404).json({ message: "Aucune photo de profil trouvée" });
      return;
    }

    const r2 = new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });

    // Define the image sizes to delete
    const sizes = ["thumbnail", "small", "medium", "large"];
    const oldKey = currentProfile.profilePictureKey;
    const oldKeyBase = oldKey.substring(0, oldKey.lastIndexOf("-"));

    // Delete all size variants of the image
    const deletePromises = sizes.map(async (size) => {
      const keyToDelete = `${oldKeyBase}-${size}.webp`;
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: keyToDelete,
      });
      try {
        await r2.send(deleteCommand);
      } catch (error) {
        console.error(
          `Erreur lors de la suppression de ${keyToDelete}:`,
          error
        );
      }
    });

    await Promise.all(deletePromises);

    // Update profile to remove the profile picture reference
    await prisma.profile.update({
      where: { userId },
      data: { profilePictureKey: null },
    });

    res.status(200).json({
      message: "Photo de profil supprimée",
      user: {
        profilePictureKey: null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "[Erreur] Impossible de supprimer la photo de profil",
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

    // Get the target user profile via User model
    const targetUser = await prisma.user.findUnique({
      where: { username: targetUsername },
      include: { Profile: true },
    });

    if (!targetUser?.Profile) {
      res.status(404).json({ message: "[Erreur] Profil cible non trouvé" });
      return;
    }

    const targetProfile = targetUser.Profile;

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

    // Get the target user profile via User model
    const targetUser = await prisma.user.findUnique({
      where: { username: targetUsername },
      include: { Profile: true },
    });

    if (!targetUser?.Profile) {
      res.status(404).json({ message: "[Erreur] Profil cible non trouvé" });
      return;
    }

    const targetProfile = targetUser.Profile;

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
          where: {
            user: { username: targetUsername },
          },
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

export const getInstrumentTypes = async (req: Request, res: Response) => {
  try {
    const instrumentTypes = await prisma.instrumentType.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        category: true,
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    // Grouper par catégorie
    const groupedInstruments = instrumentTypes.reduce((acc, instrument) => {
      const category = instrument.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(instrument);
      return acc;
    }, {} as Record<string, typeof instrumentTypes>);

    res.status(200).json(groupedInstruments);
  } catch (error) {
    console.error("Error fetching instrument types:", error);
    res.status(500).json({
      message: "[Erreur] Impossible de récupérer les types d'instruments",
    });
  }
};

export const getMusicGenres = async (req: Request, res: Response) => {
  try {
    // Récupérer tous les genres musicaux depuis l'enum
    const genres = Object.values(require("@prisma/client").MusicGenre);

    res.status(200).json(genres);
  } catch (error) {
    console.error("Error fetching music genres:", error);
    res.status(500).json({
      message: "[Erreur] Impossible de récupérer les genres musicaux",
    });
  }
};

export const getFollowersList = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const { cursor } = req.query;
    const LIMIT = 20;

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { username: username as string },
      select: { id: true, Profile: { select: { id: true } } },
    });

    if (!user || !user.Profile) {
      res.status(404).json({ message: "Profil introuvable" });
      return;
    }

    // Construire la clause where avec cursor si fourni
    const whereClause = {
      following: {
        some: {
          id: user.Profile.id,
        },
      },
      ...(cursor && { id: { gt: cursor as string } }),
    };

    // Récupérer les followers avec +1 pour savoir s'il y en a plus
    const followers = await prisma.profile.findMany({
      where: whereClause,
      take: LIMIT + 1,
      orderBy: { id: "asc" },
      select: {
        id: true,
        pseudonyme: true,
        profilePictureKey: true,
        lastActiveAt: true,
        city: true,
        departmentName: true,
        user: {
          select: {
            username: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    // Déterminer s'il y a plus de profils et préparer la réponse
    const hasMore = followers.length > LIMIT;
    const result = hasMore ? followers.slice(0, LIMIT) : followers;
    const nextCursor = hasMore ? result[result.length - 1]?.id : null;

    res.status(200).json({
      followers: result,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching followers:", error);
    res.status(500).json({
      message: "[Erreur] Impossible de récupérer la liste des followers",
    });
  }
};

export const getFollowingList = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const { cursor } = req.query;
    const LIMIT = 20;

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { username: username as string },
      select: { id: true, Profile: { select: { id: true } } },
    });

    if (!user || !user.Profile) {
      res.status(404).json({ message: "Profil introuvable" });
      return;
    }

    // Construire la clause where avec cursor si fourni
    const whereClause = {
      followers: {
        some: {
          id: user.Profile.id,
        },
      },
      ...(cursor && { id: { gt: cursor as string } }),
    };

    // Récupérer les profils suivis avec +1 pour savoir s'il y en a plus
    const following = await prisma.profile.findMany({
      where: whereClause,
      take: LIMIT + 1,
      orderBy: { id: "asc" },
      select: {
        id: true,
        pseudonyme: true,
        profilePictureKey: true,
        lastActiveAt: true,
        city: true,
        departmentName: true,
        user: {
          select: {
            username: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    // Déterminer s'il y a plus de profils et préparer la réponse
    const hasMore = following.length > LIMIT;
    const result = hasMore ? following.slice(0, LIMIT) : following;
    const nextCursor = hasMore ? result[result.length - 1]?.id : null;

    res.status(200).json({
      following: result,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching following:", error);
    res.status(500).json({
      message: "[Erreur] Impossible de récupérer la liste des profils suivis",
    });
  }
};

export const searchProfilesAutocomplete = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      res.status(401).json({ message: "Utilisateur non authentifié" });
      return;
    }

    const { q: query } = req.query;

    if (!query || typeof query !== "string") {
      res.status(400).json({
        message: "Le paramètre de recherche 'q' est requis",
      });
      return;
    }

    const searchQuery = query.trim();
    if (searchQuery.length < 2) {
      res.status(400).json({
        message: "La recherche doit contenir au moins 2 caractères",
      });
      return;
    }

    // Construire la clause where pour la recherche
    const whereClause: any = {
      OR: [
        {
          user: {
            username: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        },
        {
          pseudonyme: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
      ],
    };

    // Récupérer exactement 11 profils pour savoir s'il y en a plus
    const profiles = await prisma.profile.findMany({
      where: whereClause,
      take: 11, // 10 + 1 pour savoir s'il y en a plus
      orderBy: { id: "asc" },
      select: {
        id: true,
        pseudonyme: true,
        profilePictureKey: true,
        lastActiveAt: true,
        city: true,
        departmentName: true,
        user: {
          select: {
            username: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    // Déterminer s'il y a plus de profils
    const hasMore = profiles.length > 10;
    const result = hasMore ? profiles.slice(0, 10) : profiles;

    res.status(200).json({
      profiles: result,
      hasMore,
      totalFound: result.length,
    });
  } catch (error) {
    console.error("Erreur recherche autocomplétion:", error);
    res.status(500).json({
      message: "Erreur lors de la recherche",
    });
  }
};

export const searchProfiles = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      res.status(401).json({ message: "Utilisateur non authentifié" });
      return;
    }

    const { q: query, limit = 10, cursor } = req.query;

    if (!query || typeof query !== "string") {
      res.status(400).json({
        message: "Le paramètre de recherche 'q' est requis",
      });
      return;
    }

    const searchQuery = query.trim();
    if (searchQuery.length < 2) {
      res.status(400).json({
        message: "La recherche doit contenir au moins 2 caractères",
      });
      return;
    }

    // Construire la clause where pour la recherche
    const whereClause: any = {
      OR: [
        {
          user: {
            username: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        },
        {
          pseudonyme: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
      ],
    };

    // Ajouter le cursor pour la pagination
    if (cursor) {
      whereClause.id = { gt: cursor as string };
    }

    // Récupérer les profils avec +1 pour savoir s'il y en a plus
    const profiles = await prisma.profile.findMany({
      where: whereClause,
      take: Number(limit) + 1,
      orderBy: { id: "asc" },
      select: {
        id: true,
        pseudonyme: true,
        profilePictureKey: true,
        lastActiveAt: true,
        city: true,
        departmentName: true,
        user: {
          select: {
            username: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    // Déterminer s'il y a plus de profils
    const hasMore = profiles.length > Number(limit);
    const result = hasMore ? profiles.slice(0, Number(limit)) : profiles;
    const nextCursor = hasMore ? result[result.length - 1]?.id : null;

    res.status(200).json({
      profiles: result,
      nextCursor,
      hasMore,
      totalFound: result.length,
    });
  } catch (error) {
    console.error("Erreur recherche profils:", error);
    res.status(500).json({
      message: "Erreur lors de la recherche",
    });
  }
};
