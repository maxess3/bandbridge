import { AppError } from "./AppError";

/**
 * Erreur pour les validations échouées (400)
 * Peut accepter un message simple ou un tableau de messages
 */
export class ValidationError extends AppError {
  public readonly errors?: string[];

  constructor(message: string | string[]) {
    const errorMessage = Array.isArray(message) ? message.join(", ") : message;

    super(errorMessage, 400);

    if (Array.isArray(message)) {
      this.errors = message;
    }
  }
}
