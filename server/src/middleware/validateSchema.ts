import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express";
import { ZodType, ZodError } from "zod";
import { ValidationError, AppError } from "../errors";

/**
 * Middleware factory that validates request body against a Zod schema.
 *
 * @param schema - Zod schema to validate against
 * @returns Express middleware handler
 *
 * @remarks
 * If validation fails, returns a ValidationError with detailed error messages.
 * Should be placed before the route handler in the middleware chain.
 *
 * @throws {ValidationError} If the request body does not match the schema
 * @throws {AppError} If an unexpected error occurs during validation
 */
export const validateBodySchema =
  (schema: ZodType<any>): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map(
          (err) => `${err.path.join(".")}: ${err.message}`
        );
        return next(new ValidationError(errorMessages));
      } else {
        return next(new AppError("Internal server error", 500, false));
      }
    }
  };

/**
 * Middleware factory that validates request query parameters against a Zod schema.
 *
 * @param schema - Zod schema to validate against
 * @returns Express middleware handler
 *
 * @remarks
 * If validation fails, returns a ValidationError with detailed error messages.
 * Should be placed before the route handler in the middleware chain.
 *
 * @throws {ValidationError} If the query parameters do not match the schema
 * @throws {AppError} If an unexpected error occurs during validation
 */
export const validateQuerySchema =
  (schema: ZodType<any>): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map(
          (err) => `${err.path.join(".")}: ${err.message}`
        );
        return next(new ValidationError(errorMessages));
      } else {
        return next(new AppError("Internal server error", 500, false));
      }
    }
  };
