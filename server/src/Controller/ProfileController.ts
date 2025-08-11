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
						role: true,
						description: true,
						concertsPlayed: true,
						rehearsalsPerWeek: true,
						practiceType: true,
						genres: true,
						profilePictureKey: true,
						lastActiveAt: true,
						country: true,
						city: true,
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
								user: {
									select: {
										username: true,
										firstName: true,
										lastName: true,
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
			firstName: user.firstName,
			lastName: user.lastName,
			username: user.username,
			birthDate: user.birthDate,
			gender: user.gender,
			country: profile.country,
			zipCode: profile.zipCode,
			city: profile.city,
			role: profile.role,
			description: profile.description,
			concertsPlayed: profile.concertsPlayed,
			rehearsalsPerWeek: profile.rehearsalsPerWeek,
			practiceType: profile.practiceType,
			genres: profile.genres,
			profilePictureKey: profile.profilePictureKey,
			lastActiveAt: profile.lastActiveAt,
			createdAt: user.created_at,
			socialLinks: formattedSocialLinks,
			followers: profile._count?.followers || 0,
			following: profile._count?.following || 0,
			lastFollowers: (profile.followers || []).map(
				(follower: {
					user: {
						username: string;
						firstName: string;
						lastName: string;
					};
					_count: { followers: number };
				}) => ({
					username: follower.user.username,
					firstName: follower.user.firstName,
					lastName: follower.user.lastName,
					city: profile.city,
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
						role: true,
						description: true,
						concertsPlayed: true,
						rehearsalsPerWeek: true,
						practiceType: true,
						genres: true,
						profilePictureKey: true,
						lastActiveAt: true,
						country: true,
						city: true,
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
								user: {
									select: {
										username: true,
										firstName: true,
										lastName: true,
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
			firstName: user.firstName,
			lastName: user.lastName,
			username: user.username,
			birthDate: user.birthDate,
			gender: user.gender,
			country: profile.country,
			zipCode: profile.zipCode,
			city: profile.city,
			role: profile.role,
			description: profile.description,
			concertsPlayed: profile.concertsPlayed,
			rehearsalsPerWeek: profile.rehearsalsPerWeek,
			practiceType: profile.practiceType,
			genres: profile.genres,
			profilePictureKey: profile.profilePictureKey,
			lastActiveAt: profile.lastActiveAt,
			createdAt: user.created_at,
			socialLinks: formattedSocialLinks,
			followers: profile._count?.followers || 0,
			following: profile._count?.following || 0,
			lastFollowers: (profile.followers || []).map(
				(follower: {
					user: {
						username: string;
						firstName: string;
						lastName: string;
					};
					_count: { followers: number };
				}) => ({
					username: follower.user.username,
					firstName: follower.user.firstName,
					lastName: follower.user.lastName,
					city: profile.city,
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
			select: { id: true },
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

		// Update profile location information
		await prisma.profile.update({
			where: { userId: userId },
			data: {
				country: req.body.country,
				zipCode: req.body.zipcode,
				city: req.body.city,
			},
		});

		// Fetch the final updated data
		const updatedProfile = await prisma.profile.findUnique({
			where: { userId: userId },
			select: {
				country: true,
				zipCode: true,
				city: true,
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
				country: updatedProfile?.country,
				zipCode: updatedProfile?.zipCode,
				city: updatedProfile?.city,
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
