import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { ValidationError, AppError } from "../errors";

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

// Middleware pour gérer les erreurs Multer
export const handleMulterError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    // Erreur de taille de fichier
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(new ValidationError("File is too large. Maximum size: 5 MB"));
    }
    // Autres erreurs Multer
    return next(new ValidationError(err.message || "Error uploading file"));
  }

  // Erreurs personnalisées du fileFilter
  if (err.message) {
    return next(new ValidationError(err.message));
  }

  // Erreurs inconnues
  return next(new AppError("Internal server error", 500, false));
};

export default upload;
