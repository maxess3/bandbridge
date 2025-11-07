import { AppError } from "./AppError";

/**
 * Erreur pour les accès interdits (403)
 * L'utilisateur est authentifié mais n'a pas les permissions nécessaires
 */
export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}
