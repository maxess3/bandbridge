import { AppError } from "./AppError";

/**
 * Error for resources not found (404).
 *
 * @remarks
 * Used when a requested resource does not exist.
 */
export class NotFoundError extends AppError {
  /**
   * Creates an instance of NotFoundError.
   *
   * @param message - Error message (default: "Resource not found")
   */
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}
