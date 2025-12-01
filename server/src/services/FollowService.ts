import prisma from "../db/db.config";
import { NotFoundError, ValidationError } from "../errors";

/**
 * Service for handling follow/unfollow operations.
 * Manages social relationships between profiles.
 */
export class FollowService {
  /**
   * Validates that both profiles exist and returns them.
   * Internal utility method to factorize common validation logic.
   *
   * @param userId - Current user ID
   * @param targetUsername - Target username to follow/unfollow
   * @returns Object containing both profiles
   *
   * @throws {NotFoundError} If either profile is not found
   */
  private static async validateProfiles(
    userId: string,
    targetUsername: string
  ): Promise<{
    currentProfile: { id: string };
    targetProfile: { id: string };
  }> {
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

    return {
      currentProfile: currentUserProfile,
      targetProfile: targetUser.Profile,
    };
  }

  /**
   * Follows a user profile.
   *
   * @param currentUserId - The current user ID
   * @param targetUsername - Username of the profile to follow
   *
   * @throws {NotFoundError} If profile or target profile is not found
   * @throws {ValidationError} If user tries to follow themselves
   */
  static async followProfile(
    currentUserId: string,
    targetUsername: string
  ): Promise<void> {
    const { currentProfile, targetProfile } = await this.validateProfiles(
      currentUserId,
      targetUsername
    );

    if (currentProfile.id === targetProfile.id) {
      throw new ValidationError("You cannot follow yourself");
    }

    await prisma.profile.update({
      where: { id: currentProfile.id },
      data: {
        following: {
          connect: { id: targetProfile.id },
        },
      },
    });
  }

  /**
   * Unfollows a user profile.
   *
   * @param currentUserId - The current user ID
   * @param targetUsername - Username of the profile to unfollow
   *
   * @throws {NotFoundError} If profile or target profile is not found
   * @throws {ValidationError} If user tries to unfollow themselves
   */
  static async unfollowProfile(
    currentUserId: string,
    targetUsername: string
  ): Promise<void> {
    const { currentProfile, targetProfile } = await this.validateProfiles(
      currentUserId,
      targetUsername
    );

    if (currentProfile.id === targetProfile.id) {
      throw new ValidationError("You cannot unfollow yourself");
    }

    await prisma.profile.update({
      where: { id: currentProfile.id },
      data: {
        following: {
          disconnect: { id: targetProfile.id },
        },
      },
    });
  }

  /**
   * Checks if the current user is following a target user.
   *
   * @param currentUserId - The current user ID
   * @param targetUsername - Username of the target profile
   * @returns True if following, false otherwise
   *
   * @throws {NotFoundError} If profile is not found
   */
  static async isFollowing(
    currentUserId: string,
    targetUsername: string
  ): Promise<boolean> {
    // Get user profile with following relation
    const currentUserProfile = await prisma.profile.findUnique({
      where: { userId: currentUserId },
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

    return currentUserProfile.following.length > 0;
  }
}
