import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { ValidationError, AppError, UnauthorizedError } from "../errors";

/**
 * Multer upload configuration for handling file uploads.
 * Stores files in memory with a 5MB size limit.
 * Only allows image files (JPG, JPEG, PNG, WebP).
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Check if it's an image file
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only images are allowed"));
      return;
    }

    // Check for specific allowed extensions
    const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
    const fileExtension = file.originalname.toLowerCase().split(".").pop();

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      cb(new Error("Only JPG, JPEG, PNG and WebP formats are allowed"));
      return;
    }

    cb(null, true);
  },
});

/**
 * Middleware to handle Multer upload errors.
 *
 * @param err - The error from Multer
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 *
 * @remarks
 * Converts Multer errors to ValidationError for consistent error handling.
 * Should be placed after the upload middleware in the route chain.
 * Does NOT transform errors that are already AppError instances (like UnauthorizedError).
 *
 * @throws {ValidationError} For file size or format errors
 * @throws {AppError} For unknown errors
 */
export const handleMulterError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // First check if the error is a Multer error
  if (err instanceof multer.MulterError) {
    // File size error
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(new ValidationError("File is too large. Maximum size: 5 MB"));
    }
    // Other Multer errors
    return next(new ValidationError(err.message || "Error uploading file"));
  }

  // If the error is already an AppError (like UnauthorizedError), let it pass
  // Robust check: instanceof can fail, so we check the statusCode as well
  if (
    err instanceof AppError ||
    (err.statusCode && typeof err.statusCode === "number")
  ) {
    return next(err);
  }

  // Custom errors from fileFilter (only if it's not already an AppError)
  if (err.message && !(err instanceof AppError) && !err.statusCode) {
    return next(new ValidationError(err.message));
  }

  // Unknown errors
  return next(new AppError("Internal server error", 500, false));
};

export default upload;
