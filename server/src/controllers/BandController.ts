import { Request, Response } from "express";
import { BandService } from "../services/BandService";
import { ImageService } from "../services/ImageService";
import { UnauthorizedError, ValidationError } from "../errors";
import prisma from "../db/db.config";

/**
 * Creates a new band.
 *
 * @param req - Express request object with authenticated user and band data in body
 * @param res - Express response object
 * @returns The created band data
 *
 * @throws {UnauthorizedError} If user is not authenticated
 * @throws {ValidationError} If band name or slug already exists, or if data is invalid
 */
export const createBand = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new UnauthorizedError("User not authenticated");
  }

  const { name, slug, genres, description, country, zipcode, city } = req.body;

  // Create the band
  // genres is already parsed by Zod transform if it was a string
  const band = await BandService.createBand(userId, {
    name,
    slug,
    genres,
    description,
    country,
    zipcode,
    city,
  });

  // Handle image upload if provided
  if (req.file) {
    try {
      await ImageService.uploadBandPicture(band.id, req.file);
    } catch (error) {
      // If image upload fails, we still return the created band
      // but without the picture key
      console.error("Error uploading band picture:", error);
    }
  }

  // Fetch the updated band to ensure we have the latest data (including picture key if uploaded)
  const updatedBand = await prisma.band.findUnique({
    where: { id: band.id },
  });

  res.status(200).json({
    message: "Band created successfully",
    data: updatedBand,
  });
};

/**
 * Retrieves all bands where the authenticated user is a member.
 *
 * @param req - Express request object with authenticated user
 * @param res - Express response object
 * @returns Array of bands where the user is a member
 *
 * @throws {UnauthorizedError} If user is not authenticated
 * @throws {NotFoundError} If profile is not found
 */
export const getUserBands = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new UnauthorizedError("User not authenticated");
  }

  const bands = await BandService.getUserBands(userId);

  res.status(200).json(bands);
};
