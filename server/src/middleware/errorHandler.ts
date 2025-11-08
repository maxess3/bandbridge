import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
} from "../errors";
import { env } from "../config/env.config";

/**
 * Middleware global de gestion d'erreurs
 * Doit être placé en dernier dans la chaîne de middlewares
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Si la réponse a déjà été envoyée, déléguer au handler Express par défaut
  if (res.headersSent) {
    return next(err);
  }

  let error = err;

  // Vérifier explicitement les sous-classes d'AppError EN PREMIER (instanceof peut échouer dans certains cas)
  // Cela évite que ces erreurs soient transformées par les autres handlers
  if (
    err instanceof NotFoundError ||
    err instanceof ValidationError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError
  ) {
    error = err; // Garder l'erreur telle quelle
  }

  // DEBUG: Log temporaire pour voir ce qui se passe
  if (env.NODE_ENV === "development") {
    console.log("🔍 [DEBUG] Error type:", err.constructor.name);
    console.log("🔍 [DEBUG] Is NotFoundError?", err instanceof NotFoundError);
    console.log("🔍 [DEBUG] Is AppError?", err instanceof AppError);
    console.log("🔍 [DEBUG] Has statusCode?", "statusCode" in err);
    if ("statusCode" in err) {
      console.log("🔍 [DEBUG] statusCode value:", (err as any).statusCode);
    }
  }

  // Gérer les erreurs Prisma spécifiques (seulement si ce n'est pas déjà une AppError)
  if (
    !(error instanceof AppError) &&
    err instanceof Prisma.PrismaClientKnownRequestError
  ) {
    error = handlePrismaError(err);
  } else if (
    !(error instanceof AppError) &&
    err instanceof Prisma.PrismaClientValidationError
  ) {
    error = new ValidationError("Invalid data");
  }

  // Gérer les erreurs JWT (seulement si ce n'est pas déjà une AppError)
  if (
    !(error instanceof AppError) &&
    (err instanceof JsonWebTokenError || err instanceof TokenExpiredError)
  ) {
    error = new UnauthorizedError("Invalid or expired token");
  }

  // Gérer les erreurs Zod (seulement si ce n'est pas déjà une AppError)
  if (!(error instanceof AppError) && err instanceof ZodError) {
    const errorMessages = err.issues.map(
      (e) => `${e.path.join(".")}: ${e.message}`
    );
    error = new ValidationError(errorMessages);
  }

  // Si ce n'est pas une AppError, créer une erreur générique
  // Vérifier aussi si l'erreur a déjà un statusCode (cas où elle serait déjà une AppError mais instanceof échoue)
  if (
    !(error instanceof AppError) &&
    !("statusCode" in error && typeof (error as any).statusCode === "number")
  ) {
    error = new AppError(
      env.NODE_ENV === "production" ? "An error occurred" : error.message,
      500,
      false // Erreur technique, pas opérationnelle
    );
  }

  const appError = error as AppError;

  // S'assurer que le statusCode est bien utilisé (fallback au cas où)
  const statusCode = appError.statusCode || 500;

  // Logger l'erreur avec contexte
  logError(appError, req);

  // Préparer la réponse selon l'environnement
  const response: any = {
    message: appError.message,
    statusCode: statusCode,
  };

  // En développement, ajouter plus de détails
  if (env.NODE_ENV === "development") {
    response.stack = appError.stack;
    response.path = req.path;
    response.method = req.method;

    // Ajouter les erreurs de validation si disponibles
    if (appError instanceof ValidationError && appError.errors) {
      response.errors = appError.errors;
    }
  }

  // En production, masquer les détails des erreurs techniques
  if (env.NODE_ENV === "production" && !appError.isOperational) {
    response.message = "An error occurred";
  }

  res.status(statusCode).json(response);
};

/**
 * Gère les erreurs Prisma spécifiques et les transforme en AppError
 */
function handlePrismaError(
  err: Prisma.PrismaClientKnownRequestError
): AppError {
  switch (err.code) {
    case "P2002":
      // Violation de contrainte unique
      const target = err.meta?.target as string[] | undefined;
      const field = target ? target.join(", ") : "field";
      return new ValidationError(`${field} already exists`);

    case "P2025":
      // Enregistrement non trouvé
      return new NotFoundError("Record not found");

    case "P2003":
      // Violation de contrainte de clé étrangère
      return new ValidationError("Invalid reference");

    default:
      return new AppError(`Database error: ${err.code}`, 500, false);
  }
}

/**
 * Log l'erreur avec le contexte de la requête
 */
function logError(error: AppError, req: Request) {
  const context = {
    message: error.message,
    statusCode: error.statusCode,
    path: req.path,
    method: req.method,
    userId: (req as any).user?.userId || "anonymous",
    stack: error.stack,
  };

  if (error.statusCode >= 500) {
    // Erreurs serveur : toujours logger
    console.error("❌ [ERROR]", context);
  } else {
    // Erreurs client : logger seulement en développement
    if (env.NODE_ENV === "development") {
      console.warn("⚠️ [WARN]", context);
    }
  }
}

/**
 * Middleware pour gérer les routes non trouvées (404)
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new NotFoundError(`Route ${req.method} ${req.path} not found`);
  next(error);
};
