import prisma from "../db/db.config";
import { Prisma } from "@prisma/client";
import { calculateAge } from "../utils/utils";
import {
  formatSocialLinks,
  formatFollowersList,
  formatProfileResponse,
} from "../utils/profileFormatters";
import { ProfileResponse } from "../types/profile.types";
import { NotFoundError } from "../errors";

/**
 * Service for handling profile-related operations.
 * Manages profile retrieval, formatting, and data transformation.
 */
export class ProfileService {
  /**
   * Returns the Prisma include configuration for profile queries.
   * This configuration is reused across different profile retrieval methods.
   *
   * @returns Prisma include object for profile queries
   */
  static getProfileInclude(): Prisma.UserInclude {
    return {
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
              order: "asc" as const,
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
              lastActiveAt: "desc" as const,
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
    };
  }

  /**
   * Retrieves a profile by identifier (username or userId).
   * Unifies the logic for getProfilePublic and getProfileOwner.
   *
   * @param identifier - Username or userId to search for
   * @param type - Type of identifier: 'username' or 'userId'
   * @returns Formatted profile response
   *
   * @throws {NotFoundError} If profile is not found
   */
  static async getProfileByIdentifier(
    identifier: string,
    type: "username" | "userId"
  ): Promise<ProfileResponse> {
    const whereClause =
      type === "username" ? { username: identifier } : { id: identifier };

    const user = await prisma.user.findUnique({
      where: whereClause,
      include: this.getProfileInclude(),
    });

    if (!user || !user.Profile) {
      throw new NotFoundError("Profile not found");
    }

    const profile = user.Profile as any;

    // Calculate age
    const age = calculateAge(user.birthDate);

    // Format social links
    const formattedSocialLinks = formatSocialLinks(profile.socialLinks);

    // Format followers list
    const formattedFollowers = formatFollowersList(profile.followers);

    // Build and return formatted response
    return formatProfileResponse(
      user,
      profile,
      age,
      formattedSocialLinks,
      formattedFollowers
    );
  }
}
