import { AppError } from "./AppError";

/**
 * Erreur pour les ressources non trouvées (404)
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}
