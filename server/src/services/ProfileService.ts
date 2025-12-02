import prisma from "../db/db.config";
import { Prisma, Platform } from "../generated/client";
import { calculateAge } from "../utils/utils";
import {
  formatSocialLinks,
  formatFollowersList,
  formatProfileResponse,
} from "../utils/profileFormatters";
import { ProfileResponse } from "../types/profile.types";
import { NotFoundError, ValidationError } from "../errors";

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

  /**
   * Updates the general profile information (pseudonyme, location, genres, instruments).
   *
   * @param userId - The user ID
   * @param data - Update data containing pseudonyme, country, zipcode, city, genres, instruments
   * @returns Updated profile data
   *
   * @throws {NotFoundError} If profile is not found
   * @throws {ValidationError} If city does not match postal code
   */
  static async updateProfileGeneral(
    userId: string,
    data: {
      pseudonyme?: string;
      country?: string;
      zipcode?: string;
      city?: string;
      genres?: string[];
      instruments?: Array<{
        instrumentTypeId: string;
        level: string;
        order?: number;
      }>;
    }
  ): Promise<{
    pseudonyme: string | null;
    country: string | null;
    zipCode: string | null;
    city: string | null;
    departmentName: string | null;
    genres: string[];
    instruments: any[];
  }> {
    const currentProfile = await prisma.profile.findUnique({
      where: { userId },
      select: {
        id: true,
        country: true,
        zipCode: true,
        city: true,
        departmentName: true,
      },
    });

    if (!currentProfile) {
      throw new NotFoundError("Profile not found");
    }

    // Update profile genres
    if (data.genres !== undefined) {
      await prisma.profile.update({
        where: { userId },
        data: {
          genres: data.genres as any,
        },
      });
    }

    // Handle instruments if provided
    if (data.instruments !== undefined) {
      await this.updateInstruments(currentProfile.id, data.instruments);
    }

    // Validate and update location if provided
    let departmentName = currentProfile.departmentName;

    if (data.country && data.zipcode && data.city) {
      const hasLocationChanged =
        currentProfile.country !== data.country ||
        currentProfile.zipCode !== data.zipcode ||
        currentProfile.city !== data.city;

      if (hasLocationChanged && data.country === "France") {
        try {
          const response = await fetch(
            `https://geo.api.gouv.fr/communes?codePostal=${data.zipcode}&fields=departement`
          );

          if (response.ok) {
            const apiData = await response.json();

            // Verify that the city exists for this postal code
            const validCities = apiData.map((c: any) => c.nom);
            if (!validCities.includes(data.city)) {
              throw new ValidationError("City does not match the postal code");
            }

            // Get the department name
            departmentName = apiData[0]?.departement?.nom;
          }
        } catch (error) {
          // If it's already a ValidationError, rethrow it
          if (error instanceof ValidationError) {
            throw error;
          }
          // Otherwise, log the error but continue (external API may be unavailable)
          console.error("Error validating address:", error);
        }
      }
    }

    // Update profile location information
    const updateData: any = {};
    if (data.pseudonyme !== undefined) updateData.pseudonyme = data.pseudonyme;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.zipcode !== undefined) updateData.zipCode = data.zipcode;
    if (data.city !== undefined) updateData.city = data.city;
    if (departmentName !== currentProfile.departmentName) {
      updateData.departmentName = departmentName;
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.profile.update({
        where: { userId },
        data: updateData,
      });
    }

    // Fetch final updated data
    const updatedProfile = await prisma.profile.findUnique({
      where: { userId },
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

    if (!updatedProfile) {
      throw new NotFoundError("Profile not found");
    }

    return {
      pseudonyme: updatedProfile.pseudonyme,
      country: updatedProfile.country,
      zipCode: updatedProfile.zipCode,
      city: updatedProfile.city,
      departmentName: updatedProfile.departmentName,
      genres: updatedProfile.genres,
      instruments: updatedProfile.instruments,
    };
  }

  /**
   * Updates profile information (description, concerts, rehearsals, practice type, social links).
   *
   * @param userId - The user ID
   * @param data - Update data containing description, concerts, rehearsals, practice type, social links
   * @returns Updated profile information
   *
   * @throws {NotFoundError} If profile is not found
   */
  static async updateProfileInfo(
    userId: string,
    data: {
      description?: string | null;
      concertsPlayed?: string;
      rehearsalsPerWeek?: string;
      practiceType?: string;
      isLookingForBand?: boolean;
      youtube?: string;
      instagram?: string;
      tiktok?: string;
      twitter?: string;
      soundcloud?: string;
    }
  ): Promise<{
    username: string;
    description: string | null;
    concertsPlayed: string | null;
    rehearsalsPerWeek: string | null;
    practiceType: string | null;
    isLookingForBand: boolean;
    linksCount: number;
  }> {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundError("Profile not found");
    }

    // Update description, concerts played, rehearsals per week, and practice type
    const profileUpdateData: any = {};
    if (data.description !== undefined) {
      profileUpdateData.description = data.description || null;
    }
    if (data.concertsPlayed !== undefined) {
      profileUpdateData.concertsPlayed = data.concertsPlayed || "NOT_SPECIFIED";
    }
    if (data.rehearsalsPerWeek !== undefined) {
      profileUpdateData.rehearsalsPerWeek =
        data.rehearsalsPerWeek || "NOT_SPECIFIED";
    }
    if (data.practiceType !== undefined) {
      profileUpdateData.practiceType = data.practiceType || "NOT_SPECIFIED";
    }
    if (data.isLookingForBand !== undefined) {
      profileUpdateData.isLookingForBand = data.isLookingForBand;
    }

    if (Object.keys(profileUpdateData).length > 0) {
      await prisma.profile.update({
        where: { userId },
        data: profileUpdateData,
      });
    }

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
      if (data[key as keyof typeof data]) {
        socialLinks.push({
          platform,
          url: data[key as keyof typeof data] as string,
          profileId: profile.id,
        });
      }
    }

    if (socialLinks.length > 0) {
      await prisma.socialLink.createMany({
        data: socialLinks,
      });
    }

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

    if (!updatedUser || !updatedProfile) {
      throw new NotFoundError("Profile not found");
    }

    return {
      username: updatedUser.username,
      description: updatedProfile.description,
      concertsPlayed: updatedProfile.concertsPlayed,
      rehearsalsPerWeek: updatedProfile.rehearsalsPerWeek,
      practiceType: updatedProfile.practiceType,
      isLookingForBand: updatedProfile.isLookingForBand,
      linksCount: socialLinks.length,
    };
  }

  /**
   * Updates instruments for a profile.
   * Deletes existing instruments and creates new ones.
   *
   * @param profileId - The profile ID
   * @param instruments - Array of instruments to create
   */
  static async updateInstruments(
    profileId: string,
    instruments: Array<{
      instrumentTypeId: string;
      level: string;
      order?: number;
    }>
  ): Promise<void> {
    // Delete existing instruments
    await prisma.instrument.deleteMany({
      where: { profileId },
    });

    // Add new instruments if any
    if (instruments.length > 0) {
      const instrumentsData = instruments.map((instrument, index) => ({
        instrumentTypeId: instrument.instrumentTypeId,
        level: instrument.level as any,
        order: instrument.order ?? index,
        profileId,
      }));

      await prisma.instrument.createMany({
        data: instrumentsData as any,
      });
    }
  }

  /**
   * Searches profiles with unified logic for autocomplete and paginated search.
   *
   * @param query - Search query string
   * @param options - Search options (mode, limit, page)
   * @returns Search results with pagination info
   *
   * @throws {ValidationError} If query is invalid
   */
  static async searchProfiles(
    query: string,
    options: {
      mode?: "autocomplete" | "pagination";
      limit?: number;
      page?: number;
    } = {}
  ): Promise<{
    profiles: any[];
    hasMore?: boolean;
    totalFound?: number;
    page?: number;
    totalPages?: number;
  }> {
    const searchQuery = query.trim();
    if (searchQuery.length < 1) {
      throw new ValidationError("Search must contain at least 1 character");
    }

    const mode = options.mode || "pagination";
    const isAutocomplete = mode === "autocomplete";

    // Build where clause for search
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

    if (isAutocomplete) {
      // Autocomplete mode: limit to 10 results
      const profiles = await prisma.profile.findMany({
        where: whereClause,
        take: 11, // 10 + 1 to know if there are more
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
          instruments: {
            select: {
              instrumentTypeId: true,
              level: true,
              order: true,
              instrumentType: {
                select: {
                  name: true,
                  profession: true,
                  category: true,
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
            },
          },
        },
      });

      const hasMore = profiles.length > 10;
      const result = hasMore ? profiles.slice(0, 10) : profiles;

      return {
        profiles: result,
        hasMore,
        totalFound: result.length,
      };
    } else {
      // Pagination mode
      const pageNumber = Math.min(Math.max(1, options.page || 1), 100);
      const limitNumber = options.limit || 10;

      const skip = (pageNumber - 1) * limitNumber;

      // Calculate real total with count
      const totalFound = await prisma.profile.count({
        where: whereClause,
      });

      // Fetch profiles with classic pagination
      const profiles = await prisma.profile.findMany({
        where: whereClause,
        skip,
        take: limitNumber,
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

      // Calculate total number of pages (limited to 100 maximum)
      const totalPages = Math.min(Math.ceil(totalFound / limitNumber), 100);

      return {
        profiles,
        page: pageNumber,
        totalPages,
        totalFound,
      };
    }
  }

  /**
   * Retrieves the list of followers for a user with cursor-based pagination.
   *
   * @param username - Username of the user
   * @param cursor - Optional cursor for pagination
   * @returns Paginated list of followers
   *
   * @throws {NotFoundError} If profile is not found
   */
  static async getFollowersList(
    username: string,
    cursor?: string
  ): Promise<{
    followers: any[];
    nextCursor: string | null;
    hasMore: boolean;
  }> {
    const LIMIT = 20;

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true, Profile: { select: { id: true } } },
    });

    if (!user || !user.Profile) {
      throw new NotFoundError("Profile not found");
    }

    // Build where clause with cursor if provided
    const whereClause = {
      following: {
        some: {
          id: user.Profile.id,
        },
      },
      ...(cursor && { id: { gt: cursor } }),
    };

    // Fetch followers with +1 to know if there are more
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

    // Determine if there are more profiles and prepare response
    const hasMore = followers.length > LIMIT;
    const result = hasMore ? followers.slice(0, LIMIT) : followers;
    const nextCursor = hasMore ? result[result.length - 1]?.id : null;

    return {
      followers: result,
      nextCursor,
      hasMore,
    };
  }

  /**
   * Retrieves the list of profiles that a user is following with cursor-based pagination.
   *
   * @param username - Username of the user
   * @param cursor - Optional cursor for pagination
   * @returns Paginated list of following profiles
   *
   * @throws {NotFoundError} If profile is not found
   */
  static async getFollowingList(
    username: string,
    cursor?: string
  ): Promise<{
    following: any[];
    nextCursor: string | null;
    hasMore: boolean;
  }> {
    const LIMIT = 20;

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true, Profile: { select: { id: true } } },
    });

    if (!user || !user.Profile) {
      throw new NotFoundError("Profile not found");
    }

    // Build where clause with cursor if provided
    const whereClause = {
      followers: {
        some: {
          id: user.Profile.id,
        },
      },
      ...(cursor && { id: { gt: cursor } }),
    };

    // Fetch following profiles with +1 to know if there are more
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

    // Determine if there are more profiles and prepare response
    const hasMore = following.length > LIMIT;
    const result = hasMore ? following.slice(0, LIMIT) : following;
    const nextCursor = hasMore ? result[result.length - 1]?.id : null;

    return {
      following: result,
      nextCursor,
      hasMore,
    };
  }
}
