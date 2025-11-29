import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import prisma from "../db/db.config";
import { getS3Client } from "../config/s3.config";
import {
  IMAGE_SIZES,
  IMAGE_SIZE_NAMES,
  WEBP_QUALITY,
} from "../config/image.config";
import { env } from "../config/env.config";
import { NotFoundError } from "../errors";

/**
 * Service for handling image upload and deletion operations.
 * Manages profile picture uploads with multiple size variants.
 */
export class ImageService {
  /**
   * Uploads a profile picture in multiple sizes and updates the profile.
   *
   * @param userId - The user ID
   * @param file - The uploaded file from Multer
   * @returns The profile picture key (medium size)
   *
   * @throws {NotFoundError} If profile is not found
   */
  static async uploadProfilePicture(
    userId: string,
    file: Express.Multer.File
  ): Promise<string> {
    const uuid = uuidv4();
    const s3Client = getS3Client();

    // Get current profile to check for existing picture
    const currentProfile = await prisma.profile.findUnique({
      where: { userId },
      select: { profilePictureKey: true },
    });

    if (!currentProfile) {
      throw new NotFoundError("Profile not found");
    }

    // Delete old images if they exist
    if (currentProfile.profilePictureKey) {
      await this.deleteImageVariants(currentProfile.profilePictureKey);
    }

    // Upload all size variants
    const uploadPromises = Object.entries(IMAGE_SIZES).map(
      async ([size, width]) => {
        const resizedImage = await sharp(file.buffer)
          .resize(width, width, {
            fit: "cover",
            withoutEnlargement: true,
          })
          .webp({ quality: WEBP_QUALITY })
          .toBuffer();

        const key = `profile-pictures/${userId}/${uuid}-${size}.webp`;

        const command = new PutObjectCommand({
          Bucket: env.R2_BUCKET_NAME,
          Key: key,
          Body: resizedImage,
          ContentType: "image/webp",
        });

        await s3Client.send(command);
        return { size, key };
      }
    );

    const uploadedImages = await Promise.all(uploadPromises);

    // Update profile with main image key (medium size)
    const mainImageKey = uploadedImages.find(
      (img) => img.size === "medium"
    )?.key;
    if (!mainImageKey) {
      throw new Error("Failed to upload profile picture");
    }

    await prisma.profile.update({
      where: { userId },
      data: { profilePictureKey: mainImageKey },
    });

    return mainImageKey;
  }

  /**
   * Deletes a profile picture and all its size variants.
   *
   * @param userId - The user ID
   * @param profilePictureKey - The current profile picture key
   *
   * @throws {NotFoundError} If profile is not found
   */
  static async deleteProfilePicture(
    userId: string,
    profilePictureKey: string
  ): Promise<void> {
    const s3Client = getS3Client();

    // Verify profile exists
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundError("Profile not found");
    }

    // Delete all size variants
    await this.deleteImageVariants(profilePictureKey);

    // Update profile to remove profile picture reference
    await prisma.profile.update({
      where: { userId },
      data: { profilePictureKey: null },
    });
  }

  /**
   * Deletes all size variants of an image from S3.
   * Internal utility method.
   *
   * @param profilePictureKey - The base profile picture key
   */
  private static async deleteImageVariants(
    profilePictureKey: string
  ): Promise<void> {
    const s3Client = getS3Client();
    const oldKeyBase = profilePictureKey.substring(
      0,
      profilePictureKey.lastIndexOf("-")
    );

    // Delete all size variants
    const deletePromises = IMAGE_SIZE_NAMES.map(async (size) => {
      const keyToDelete = `${oldKeyBase}-${size}.webp`;
      const deleteCommand = new DeleteObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: keyToDelete,
      });
      try {
        await s3Client.send(deleteCommand);
      } catch (error) {
        // Log error but continue (image may already be deleted)
        console.error(`Error deleting ${keyToDelete}:`, error);
      }
    });

    await Promise.all(deletePromises);
  }
}
