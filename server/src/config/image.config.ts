/**
 * Image size configuration for profile pictures.
 * Defines the dimensions for different image variants.
 */
export const IMAGE_SIZES = {
  thumbnail: 44,
  small: 80,
  medium: 224,
  large: 400,
} as const;

/**
 * Image size names as an array.
 * Useful for iterating over all sizes.
 */
export const IMAGE_SIZE_NAMES = [
  "thumbnail",
  "small",
  "medium",
  "large",
] as const;

/**
 * WebP quality setting for image compression.
 * Range: 1-100, where 80 provides a good balance between quality and file size.
 */
export const WEBP_QUALITY = 80;

/**
 * Maximum file size for image uploads (in bytes).
 * Currently set to 5MB.
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Type for image size names.
 */
export type ImageSizeName = (typeof IMAGE_SIZE_NAMES)[number];
