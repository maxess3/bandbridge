import { AppError } from "./AppError";

/**
 * Erreur pour les accès non autorisés (401)
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}
