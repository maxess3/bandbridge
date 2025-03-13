import { Request, Response, NextFunction } from "express";
import { RequestHandler } from "express";
import { AnyZodObject, ZodError, ZodEffects } from "zod";

export const validateSchema =
  (schema: AnyZodObject | ZodEffects<any>): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        res.status(500).json({ message: "Erreur interne du serveur" });
      }
    }
  };
