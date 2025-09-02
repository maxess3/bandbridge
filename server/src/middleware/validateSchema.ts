import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express";
import { AnyZodObject, ZodError, ZodEffects } from "zod";

export const validateBodySchema =
  (schema: AnyZodObject | ZodEffects<any>): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");

        res.status(400).json({ message: errorMessages });
      } else {
        res.status(500).json({ message: "Erreur interne du serveur" });
      }
    }
  };

export const validateQuerySchema =
  (schema: AnyZodObject | ZodEffects<any>): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");

        res.status(400).json({ message: errorMessages });
      } else {
        res.status(500).json({ message: "Erreur interne du serveur" });
      }
    }
  };
