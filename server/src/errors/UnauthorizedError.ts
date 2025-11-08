import { AppError } from "./AppError";

/**
 * Error for unauthorized access (401).
 *
 * @remarks
 * Used when authentication is required but missing or invalid.
 */
export class UnauthorizedError extends AppError {
  /**
   * Creates an instance of UnauthorizedError.
   *
   * @param message - Error message (default: "Unauthorized")
   */
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}
