import prisma from "../db/db.config";
import { MusicGenre } from "../generated/client";
import { ValidationError, NotFoundError, ForbiddenError } from "../errors";
import { validateMusicGenres } from "../utils/validators";
import type {
  BandBySlugResult,
  BandMemberListItem,
} from "../types/band.types";

/**
 * Service for handling band-related operations.
 * Manages band creation, validation, and data transformation.
 */
export class BandService {
  /**
   * Calculates the department name from zipcode using the French geo API.
   *
   * @param zipcode - The postal code
   * @param city - The city name to validate
   * @returns The department name or null if API call fails
   * @throws {ValidationError} If city does not match postal code
   */
  private static async calculateDepartmentName(
    zipcode: string,
    city: string,
  ): Promise<string | null> {
    try {
      const response = await fetch(
        `https://geo.api.gouv.fr/communes?codePostal=${zipcode}&fields=departement`,
      );

      if (response.ok) {
        const apiData = await response.json();

        // Verify that the city exists for this postal code
        const validCities = apiData.map((c: any) => c.nom);
        if (!validCities.includes(city)) {
          throw new ValidationError("City does not match the postal code");
        }

        // Get the department name
        return apiData[0]?.departement?.nom || null;
      }
    } catch (error) {
      // If it's already a ValidationError, rethrow it
      if (error instanceof ValidationError) {
        throw error;
      }
      // Otherwise, log the error but continue (external API may be unavailable)
      console.error("Error validating address:", error);
    }

    return null;
  }

  /**
   * Creates a new band and adds the creator as a member.
   *
   * @param userId - The user ID of the creator
   * @param data - Band creation data
   * @returns The created band
   *
   * @throws {ValidationError} If name already exists, if genres/city are invalid, or if user is already a member of a band
   * @throws {NotFoundError} If user profile is not found
   */
  static async createBand(
    userId: string,
    data: {
      name: string;
      genres: string[];
      description: string;
      country: string;
      zipcode: string;
      city: string;
    },
  ) {
    // Validate genres
    validateMusicGenres(data.genres);

    // Check if name already exists
    const existingBand = await prisma.band.findFirst({
      where: { name: data.name },
    });

    if (existingBand) {
      throw new ValidationError("A band with this name already exists");
    }

    // Get user profile to ensure it exists and get profile ID
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundError("Profile not found");
    }

    // Check if user is already a member of a band (limit: 1 band per user)
    const existingBandsCount = await prisma.bandMember.count({
      where: { profileId: profile.id },
    });

    if (existingBandsCount > 0) {
      throw new ValidationError(
        "You can only create or be a member of one band",
      );
    }

    // Calculate department name
    let departmentName: string | null = null;
    if (data.country === "France") {
      departmentName = await this.calculateDepartmentName(
        data.zipcode,
        data.city,
      );
    }

    // Create the band and add creator as admin in a transaction
    const band = await prisma.$transaction(async (tx) => {
      const newBand = await tx.band.create({
        data: {
          name: data.name,
          genres: data.genres as MusicGenre[],
          description: data.description,
          country: data.country,
          city: data.city,
          zipCode: data.zipcode,
          departmentName: departmentName,
        },
      });

      await tx.bandMember.create({
        data: {
          bandId: newBand.id,
          profileId: profile.id,
          role: "ADMIN",
        },
      });

      return newBand;
    });

    return band;
  }

  /**
   * Retrieves all bands where the user is a member.
   *
   * @param userId - The user ID
   * @returns Array of bands where the user is a member
   *
   * @throws {NotFoundError} If user profile is not found
   */
  static async getUserBands(userId: string) {
    // Get user profile to ensure it exists and get profile ID
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundError("Profile not found");
    }

    // Find all bands where the user is a member (with role)
    const bandMemberships = await prisma.bandMember.findMany({
      where: { profileId: profile.id },
      include: {
        band: {
          select: {
            id: true,
            name: true,
            profilePictureKey: true,
            description: true,
          },
        },
      },
    });

    const bands = bandMemberships.map((bm) => ({
      ...bm.band,
      role: bm.role,
    }));

    return bands;
  }

  /**
   * Retrieves all bands with pagination support.
   * Similar to ProfileService.getAllProfiles but for bands.
   * Limit is fixed at 24 items per page.
   *
   * @param options - Pagination options (page only, limit is fixed at 24)
   * @returns Paginated list of all bands
   */
  static async getAllBands(
    options: {
      limit?: number;
      page?: number;
    } = {},
  ): Promise<{
    bands: any[];
    page: number;
    totalPages: number;
    totalFound: number;
  }> {
    const pageNumber = Math.min(Math.max(1, options.page || 1), 100);
    const limitNumber = options.limit ?? 24; // Default to 24, but allow override if needed

    const skip = (pageNumber - 1) * limitNumber;

    // Calculate real total with count
    const totalFound = await prisma.band.count();

    // Fetch bands with classic pagination (no where clause - all bands)
    const bands = await prisma.band.findMany({
      skip,
      take: limitNumber,
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        profilePictureKey: true,
        description: true,
        city: true,
        departmentName: true,
        _count: {
          select: {
            bandMembers: true,
          },
        },
      },
    });

    // Calculate total number of pages (limited to 100 maximum)
    const totalPages = Math.min(Math.ceil(totalFound / limitNumber), 100);

    return {
      bands,
      page: pageNumber,
      totalPages,
      totalFound,
    };
  }

  /**
   * Retrieves a band by id for the group page.
   * If userId is provided and the user is a member, includes their role.
   *
   * @param id - The band UUID
   * @param userId - Optional user ID to attach current user's role
   * @returns Band data for the page
   * @throws {NotFoundError} If band is not found
   */
  static async getBandById(
    id: string,
    userId?: string,
  ): Promise<BandBySlugResult> {
    const band = await prisma.band.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        profilePictureKey: true,
        description: true,
        country: true,
        city: true,
        zipCode: true,
        departmentName: true,
        genres: true,
        _count: {
          select: {
            bandMembers: true,
            hiringAds: true,
          },
        },
      },
    });

    if (!band) {
      throw new NotFoundError("Band not found");
    }

    const result: BandBySlugResult = {
      ...band,
      _count: band._count,
    };

    if (userId) {
      const profile = await prisma.profile.findUnique({
        where: { userId },
        select: { id: true },
      });
      if (profile) {
        const membership = await prisma.bandMember.findUnique({
          where: {
            bandId_profileId: {
              bandId: band.id,
              profileId: profile.id,
            },
          },
          select: { role: true },
        });
        if (membership) {
          result.role = membership.role;
        }
      }
    }

    return result;
  }

  /**
   * Returns the list of members of a band. Only callable by an authenticated user who is a member of the band.
   *
   * @param bandId - Band UUID
   * @param userId - Authenticated user ID
   * @returns Array of members with profile (ProfileListItem shape) and role
   * @throws {NotFoundError} If band is not found
   * @throws {ForbiddenError} If user is not a member of the band
   */
  static async getBandMembers(
    bandId: string,
    userId: string,
  ): Promise<BandMemberListItem[]> {
    const band = await prisma.band.findUnique({
      where: { id: bandId },
      select: { id: true },
    });

    if (!band) {
      throw new NotFoundError("Band not found");
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new ForbiddenError("Access denied");
    }

    const requesterMembership = await prisma.bandMember.findUnique({
      where: {
        bandId_profileId: {
          bandId: band.id,
          profileId: profile.id,
        },
      },
    });

    if (!requesterMembership) {
      throw new ForbiddenError("Access denied");
    }

    const bandMembers = await prisma.bandMember.findMany({
      where: { bandId: band.id },
      select: {
        role: true,
        profile: {
          select: {
            id: true,
            pseudonyme: true,
            profilePictureKey: true,
            lastActiveAt: true,
            city: true,
            departmentName: true,
            user: {
              select: { username: true },
            },
            _count: {
              select: { followers: true },
            },
          },
        },
      },
    });

    return bandMembers.map((bm) => ({
      profile: bm.profile,
      role: bm.role,
    }));
  }

  /**
   * Creates a hiring ad for a band. Only band admins can create ads.
   *
   * @param userId - Authenticated user ID
   * @param bandId - Band UUID (from URL params)
   * @param data - Title, content, optional location/rehearsals, required slots (roleId + quantity)
   * @returns The created BandHiringAd with requiredSlots
   * @throws {NotFoundError} If band is not found
   * @throws {ForbiddenError} If user is not an admin of the band
   * @throws {ValidationError} If (bandId, title) already exists or validation fails
   */
  static async createHiringAd(
    userId: string,
    bandId: string,
    data: {
      title: string;
      content: string;
      rehearsalsPerWeek?: string;
      country?: string;
      city?: string;
      zipCode?: string;
      departmentName?: string;
      requiredSlots: Array<{ roleId: string; quantity: number }>;
    }
  ) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundError("Profile not found");
    }

    const band = await prisma.band.findUnique({
      where: { id: bandId },
      select: { id: true },
    });

    if (!band) {
      throw new NotFoundError("Band not found");
    }

    const membership = await prisma.bandMember.findUnique({
      where: {
        bandId_profileId: {
          bandId: band.id,
          profileId: profile.id,
        },
      },
      select: { role: true },
    });

    if (!membership || membership.role !== "ADMIN") {
      throw new ForbiddenError(
        "Only band administrators can create hiring ads"
      );
    }

    const existingAd = await prisma.bandHiringAd.findUnique({
      where: {
        bandId_title: {
          bandId: band.id,
          title: data.title,
        },
      },
    });

    if (existingAd) {
      throw new ValidationError(
        "An ad with this title already exists for this band"
      );
    }

    const roleIds = [...new Set(data.requiredSlots.map((s) => s.roleId))];
    const existingRoles = await prisma.role.findMany({
      where: { id: { in: roleIds } },
      select: { id: true },
    });
    if (existingRoles.length !== roleIds.length) {
      throw new ValidationError("Un ou plusieurs rôles sont invalides");
    }

    const ad = await prisma.$transaction(async (tx) => {
      const hiringAd = await tx.bandHiringAd.create({
        data: {
          bandId: band.id,
          title: data.title,
          content: data.content,
          rehearsalsPerWeek: data.rehearsalsPerWeek as
            | "NOT_SPECIFIED"
            | "ONCE_PER_WEEK"
            | "TWO_TO_THREE_PER_WEEK"
            | "MORE_THAN_THREE_PER_WEEK"
            | undefined,
          country: data.country,
          city: data.city,
          zipCode: data.zipCode,
          departmentName: data.departmentName,
        },
      });

      await tx.bandRequiredSlot.createMany({
        data: data.requiredSlots.map((slot) => ({
          hiringAdId: hiringAd.id,
          roleId: slot.roleId,
          quantity: slot.quantity,
        })),
      });

      return tx.bandHiringAd.findUnique({
        where: { id: hiringAd.id },
        include: {
          requiredSlots: {
            select: {
              id: true,
              roleId: true,
              quantity: true,
              role: { select: { id: true, name: true } },
            },
          },
        },
      });
    });

    return ad;
  }
}
