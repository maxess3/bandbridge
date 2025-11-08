import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express";
import { ZodType, ZodError } from "zod";
import { ValidationError, AppError } from "../errors";

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
