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
				// [BUG] error.errors is an array of objects, not a string
				res.status(400).json({ message: error.errors });
			} else {
				res.status(500).json({ message: "Erreur interne du serveur" });
			}
		}
	};
