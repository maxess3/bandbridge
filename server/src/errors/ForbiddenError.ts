import { AppError } from "./AppError";

/**
 * Error for forbidden access (403).
 *
 * @remarks
 * Used when the user is authenticated but does not have the necessary permissions.
 */
export class ForbiddenError extends AppError {
  /**
   * Creates an instance of ForbiddenError.
   *
   * @param message - Error message (default: "Forbidden")
   */
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}
