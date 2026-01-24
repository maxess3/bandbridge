import prisma from "../db/db.config";
import { MusicGenre } from "../generated/client";
import { ValidationError, NotFoundError } from "../errors";
import { validateMusicGenres } from "../utils/validators";

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
   * @throws {ValidationError} If name or slug already exists, if genres/city are invalid, or if user is already a member of a band
   * @throws {NotFoundError} If user profile is not found
   */
  static async createBand(
    userId: string,
    data: {
      name: string;
      slug: string;
      genres: string[];
      description: string;
      country: string;
      zipcode: string;
      city: string;
    },
  ) {
    // Validate genres
    validateMusicGenres(data.genres);

    // Check if name or slug already exists
    const existingBand = await prisma.band.findFirst({
      where: {
        OR: [{ name: data.name }, { slug: data.slug }],
      },
    });

    if (existingBand) {
      if (existingBand.name === data.name) {
        throw new ValidationError("A band with this name already exists");
      }
      if (existingBand.slug === data.slug) {
        throw new ValidationError("A band with this slug already exists");
      }
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
    const existingBandsCount = await prisma.band.count({
      where: {
        members: {
          some: {
            id: profile.id,
          },
        },
      },
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

    // Create the band and add creator as member in a transaction
    const band = await prisma.$transaction(async (tx) => {
      const newBand = await tx.band.create({
        data: {
          name: data.name,
          slug: data.slug,
          genres: data.genres as MusicGenre[],
          description: data.description,
          country: data.country,
          city: data.city,
          zipCode: data.zipcode,
          departmentName: departmentName,
          members: {
            connect: [{ id: profile.id }],
          },
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

    // Find all bands where the user is a member
    const bands = await prisma.band.findMany({
      where: {
        members: {
          some: {
            id: profile.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        profilePictureKey: true,
        description: true,
      },
    });

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
        slug: true,
        profilePictureKey: true,
        description: true,
        city: true,
        departmentName: true,
        _count: {
          select: {
            members: true,
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
}
