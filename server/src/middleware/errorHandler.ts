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
 * Global error handling middleware.
 * Must be placed last in the middleware chain.
 *
 * @param err - The error to handle (Error or AppError)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 *
 * @remarks
 * This middleware transforms all errors into standardized AppError instances
 * and prepares an appropriate JSON response based on the environment.
 * It handles Prisma, JWT, and Zod errors by converting them to AppError types.
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If response has already been sent, delegate to Express default handler
  if (res.headersSent) {
    return next(err);
  }

  let error = err;

  // Check AppError subclasses explicitly FIRST (instanceof can fail in some cases)
  // This prevents these errors from being transformed by other handlers
  if (
    err instanceof NotFoundError ||
    err instanceof ValidationError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError
  ) {
    error = err; // Keep error as is
  }

  // Handle Prisma-specific errors (only if not already an AppError)
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

  // Handle JWT errors (only if not already an AppError)
  if (
    !(error instanceof AppError) &&
    (err instanceof JsonWebTokenError || err instanceof TokenExpiredError)
  ) {
    error = new UnauthorizedError("Invalid or expired token");
  }

  // Handle Zod errors (only if not already an AppError)
  if (!(error instanceof AppError) && err instanceof ZodError) {
    const errorMessages = err.issues.map(
      (e) => `${e.path.join(".")}: ${e.message}`
    );
    error = new ValidationError(errorMessages);
  }

  // If not an AppError, create a generic error
  // Also check if error already has a statusCode (case where it would be an AppError but instanceof fails)
  if (
    !(error instanceof AppError) &&
    !("statusCode" in error && typeof (error as any).statusCode === "number")
  ) {
    error = new AppError(
      env.NODE_ENV === "production" ? "An error occurred" : error.message,
      500,
      false // Technical error, not operational
    );
  }

  const appError = error as AppError;

  // Ensure statusCode is used (fallback just in case)
  const statusCode = appError.statusCode || 500;

  // Log error with context
  logError(appError, req);

  // Prepare response based on environment
  const response: any = {
    message: appError.message,
    statusCode: statusCode,
  };

  // In development, add more details
  if (env.NODE_ENV === "development") {
    response.stack = appError.stack;
    response.path = req.path;
    response.method = req.method;

    // Add validation errors if available
    if (appError instanceof ValidationError && appError.errors) {
      response.errors = appError.errors;
    }
  }

  // In production, hide details of technical errors
  if (env.NODE_ENV === "production" && !appError.isOperational) {
    response.message = "An error occurred";
  }

  res.status(statusCode).json(response);
};

/**
 * Handles Prisma-specific errors and transforms them into AppError.
 *
 * @param err - Prisma known request error
 * @returns AppError instance
 */
function handlePrismaError(
  err: Prisma.PrismaClientKnownRequestError
): AppError {
  switch (err.code) {
    case "P2002":
      // Unique constraint violation
      const target = err.meta?.target as string[] | undefined;
      const field = target ? target.join(", ") : "field";
      return new ValidationError(`${field} already exists`);

    case "P2025":
      // Record not found
      return new NotFoundError("Record not found");

    case "P2003":
      // Foreign key constraint violation
      return new ValidationError("Invalid reference");

    default:
      return new AppError(`Database error: ${err.code}`, 500, false);
  }
}

/**
 * Logs the error with request context.
 *
 * @param error - The error to log
 * @param req - Express request object
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
    // Server errors: always log
    console.error("❌ [ERROR]", context);
  } else {
    // Client errors: log only in development
    if (env.NODE_ENV === "development") {
      console.warn("⚠️ [WARN]", context);
    }
  }
}

/**
 * Middleware to handle routes not found (404).
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 *
 * @remarks
 * This middleware should be placed after all route definitions
 * but before the error handler middleware.
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new NotFoundError(`Route ${req.method} ${req.path} not found`);
  next(error);
};
