import prisma from "../db/db.config";
import { Request, Response } from "express";
import { ImageService } from "../services/ImageService";
import { ProfileService } from "../services/ProfileService";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  AppError,
} from "../errors";

/**
 * Retrieves a public profile by username.
 *
 * @param req - Express request object with username in params
 * @param res - Express response object
 * @returns Public profile data including instruments, genres, followers, and social links
 *
 * @throws {NotFoundError} If profile is not found
 */
export const getProfilePublic = async (req: Request, res: Response) => {
  const { username } = req.params;

  const profile = await ProfileService.getProfileByIdentifier(
    username,
    "username"
  );

  res.status(200).json(profile);
};

/**
 * Retrieves the authenticated user's own profile.
 *
 * @param req - Express request object with authenticated user
 * @param res - Express response object
 * @returns Complete profile data for the authenticated user
 *
 * @throws {UnauthorizedError} If user is not authenticated
 * @throws {NotFoundError} If profile is not found
 */
export const getProfileOwner = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  if (!userId) {
    throw new UnauthorizedError("User not authenticated");
  }

  const profile = await ProfileService.getProfileByIdentifier(userId, "userId");

  res.status(200).json(profile);
};

/**
 * Updates the general profile information (pseudonyme, location, genres, instruments).
 *
 * @param req - Express request object with authenticated user and profile data in body
 * @param res - Express response object
 * @returns Updated profile data
 *
 * @throws {UnauthorizedError} If user is not authenticated
 * @throws {NotFoundError} If profile is not found
 * @throws {ValidationError} If city does not match postal code
 */
export const updateGeneralProfileOwner = async (
  req: Request,
  res: Response
) => {
  const userId = req.user.userId;
  if (!userId) {
    throw new UnauthorizedError("User not authenticated");
  }

  const updatedProfile = await ProfileService.updateProfileGeneral(
    userId,
    req.body
  );

  res.status(200).json({
    message: "Profile updated successfully",
    user: updatedProfile,
  });
};

/**
 * Updates profile information (description, concerts, rehearsals, practice type, social links).
 *
 * @param req - Express request object with authenticated user and profile info in body
 * @param res - Express response object
 * @returns Updated profile information
 *
 * @throws {UnauthorizedError} If user is not authenticated
 * @throws {NotFoundError} If profile is not found
 */
export const updateInfoProfileOwner = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  if (!userId) {
    throw new UnauthorizedError("User not authenticated");
  }

  const updatedInfo = await ProfileService.updateProfileInfo(userId, req.body);

  res.status(200).json({
    message: "Information updated successfully",
    user: {
      username: updatedInfo.username,
      description: updatedInfo.description,
      concertsPlayed: updatedInfo.concertsPlayed,
      rehearsalsPerWeek: updatedInfo.rehearsalsPerWeek,
      practiceType: updatedInfo.practiceType,
      isLookingForBand: updatedInfo.isLookingForBand,
    },
    links: { count: updatedInfo.linksCount },
  });
};

/**
 * Uploads and processes a profile picture in multiple sizes.
 *
 * @param req - Express request object with authenticated user and file in body
 * @param res - Express response object
 * @returns Updated profile picture key
 *
 * @throws {UnauthorizedError} If user is not authenticated
 * @throws {ValidationError} If no file is uploaded
 * @throws {NotFoundError} If profile is not found
 */
export const uploadProfilePicture = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  if (!userId) {
    throw new UnauthorizedError("User not authenticated");
  }

  if (!req.file) {
    throw new ValidationError("No file uploaded");
  }

  const profilePictureKey = await ImageService.uploadProfilePicture(
    userId,
    req.file
  );

  res.status(200).json({
    message: "Profile picture updated",
    user: {
      profilePictureKey,
    },
  });
};

/**
 * Deletes the user's profile picture and all size variants.
 *
 * @param req - Express request object with authenticated user
 * @param res - Express response object
 * @returns Success message
 *
 * @throws {UnauthorizedError} If user is not authenticated
 * @throws {NotFoundError} If no profile picture is found
 */
export const deleteProfilePicture = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  if (!userId) {
    throw new UnauthorizedError("User not authenticated");
  }

  const currentProfile = await prisma.profile.findUnique({
    where: { userId },
    select: { profilePictureKey: true },
  });

  if (!currentProfile?.profilePictureKey) {
    throw new NotFoundError("No profile picture found");
  }

  await ImageService.deleteProfilePicture(
    userId,
    currentProfile.profilePictureKey
  );

  res.status(200).json({
    message: "Profile picture deleted",
    user: {
      profilePictureKey: null,
    },
  });
};

/**
 * Follows a user profile.
 *
 * @param req - Express request object with authenticated user and targetUsername in params
 * @param res - Express response object
 * @returns Success message
 *
 * @throws {UnauthorizedError} If user is not authenticated
 * @throws {NotFoundError} If profile or target profile is not found
 * @throws {ValidationError} If user tries to follow themselves
 */
export const follow = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { targetUsername } = req.params;

  if (!userId) {
    throw new UnauthorizedError("Not authenticated");
  }

  // Get the user profile
  const currentUserProfile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!currentUserProfile) {
    throw new NotFoundError("Profile not found");
  }

  // Get the target user profile via User model
  const targetUser = await prisma.user.findUnique({
    where: { username: targetUsername },
    include: { Profile: true },
  });

  if (!targetUser?.Profile) {
    throw new NotFoundError("Target profile not found");
  }

  const targetProfile = targetUser.Profile;

  // Check if user profile is not the target profile
  if (currentUserProfile.id === targetProfile.id) {
    throw new ValidationError("You cannot follow yourself");
  }

  // Add follow relation
  await prisma.profile.update({
    where: { id: currentUserProfile.id },
    data: {
      following: {
        connect: { id: targetProfile.id },
      },
    },
  });

  res.status(200).json({ message: "Profile followed successfully" });
};

/**
 * Unfollows a user profile.
 *
 * @param req - Express request object with authenticated user and targetUsername in params
 * @param res - Express response object
 * @returns Success message
 *
 * @throws {UnauthorizedError} If user is not authenticated
 * @throws {NotFoundError} If profile or target profile is not found
 */
export const unfollow = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { targetUsername } = req.params;

  if (!userId) {
    throw new UnauthorizedError("Not authenticated");
  }

  // Get the user profile
  const currentUserProfile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!currentUserProfile) {
    throw new NotFoundError("Profile not found");
  }

  // Get the target user profile via User model
  const targetUser = await prisma.user.findUnique({
    where: { username: targetUsername },
    include: { Profile: true },
  });

  if (!targetUser?.Profile) {
    throw new NotFoundError("Target profile not found");
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

  res.status(200).json({ message: "Profile unfollowed successfully" });
};

/**
 * Checks if the authenticated user is following a target user.
 *
 * @param req - Express request object with authenticated user and targetUsername in params
 * @param res - Express response object
 * @returns Following status and timestamp
 *
 * @throws {UnauthorizedError} If user is not authenticated
 * @throws {NotFoundError} If profile is not found
 */
export const isFollowing = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { targetUsername } = req.params;

  if (!userId) {
    throw new UnauthorizedError("Not authenticated");
  }

  // Get user profile with following relation
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
    throw new NotFoundError("Profile not found");
  }

  // Check if following relation exists
  const isFollowing = currentUserProfile.following.length > 0;

  res.status(200).json({
    isFollowing,
    targetUsername,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Retrieves all active instrument types grouped by category.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns Instrument types grouped by category
 */
export const getInstrumentTypes = async (req: Request, res: Response) => {
  const instrumentTypes = await prisma.instrumentType.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      category: true,
    },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  // Group by category
  const groupedInstruments = instrumentTypes.reduce((acc, instrument) => {
    const category = instrument.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(instrument);
    return acc;
  }, {} as Record<string, typeof instrumentTypes>);

  res.status(200).json(groupedInstruments);
};

export const getMusicGenres = async (req: Request, res: Response) => {
  // Récupérer tous les genres musicaux depuis l'enum
  const genres = Object.values(require("@prisma/client").MusicGenre);

  res.status(200).json(genres);
};

/**
 * Retrieves the list of followers for a user with cursor-based pagination.
 *
 * @param req - Express request object with username in params and optional cursor in query
 * @param res - Express response object
 * @returns Paginated list of followers
 *
 * @throws {NotFoundError} If profile is not found
 */
export const getFollowersList = async (req: Request, res: Response) => {
  const { username } = req.params;
  const { cursor } = req.query;

  const result = await ProfileService.getFollowersList(
    username,
    cursor as string | undefined
  );

  res.status(200).json(result);
};

/**
 * Retrieves the list of profiles that a user is following with cursor-based pagination.
 *
 * @param req - Express request object with username in params and optional cursor in query
 * @param res - Express response object
 * @returns Paginated list of following profiles
 *
 * @throws {NotFoundError} If profile is not found
 */
export const getFollowingList = async (req: Request, res: Response) => {
  const { username } = req.params;
  const { cursor } = req.query;

  const result = await ProfileService.getFollowingList(
    username,
    cursor as string | undefined
  );

  res.status(200).json(result);
};

/**
 * Searches profiles for autocomplete suggestions (limited to 10 results).
 *
 * @param req - Express request object with authenticated user and query parameter 'q'
 * @param res - Express response object
 * @returns Limited list of matching profiles (max 10)
 *
 * @throws {UnauthorizedError} If user is not authenticated
 * @throws {ValidationError} If query parameter is missing or invalid
 */
export const searchProfilesAutocomplete = async (
  req: Request,
  res: Response
) => {
  const userId = req.user.userId;

  if (!userId) {
    throw new UnauthorizedError("User not authenticated");
  }

  const { q: query } = req.query;

  if (!query || typeof query !== "string") {
    throw new ValidationError("Search parameter 'q' is required");
  }

  const result = await ProfileService.searchProfiles(query, {
    mode: "autocomplete",
  });

  res.status(200).json(result);
};

/**
 * Searches profiles with pagination support.
 *
 * @param req - Express request object with authenticated user, query parameter 'q', and optional limit/page
 * @param res - Express response object
 * @returns Paginated list of matching profiles
 *
 * @throws {UnauthorizedError} If user is not authenticated
 * @throws {ValidationError} If query parameter is missing or invalid
 */
export const searchProfiles = async (req: Request, res: Response) => {
  const userId = req.user.userId;

  if (!userId) {
    throw new UnauthorizedError("User not authenticated");
  }

  const { q: query, limit = 10, page = 1 } = req.query;

  if (!query || typeof query !== "string") {
    throw new ValidationError("Search parameter 'q' is required");
  }

  const result = await ProfileService.searchProfiles(query, {
    mode: "pagination",
    limit: Number(limit),
    page: Number(page),
  });

  res.status(200).json(result);
};
