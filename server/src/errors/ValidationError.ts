import { AppError } from "./AppError";

/**
 * Error for failed validations (400).
 * Can accept a simple message or an array of messages.
 *
 * @remarks
 * When an array of messages is provided, the errors property will contain
 * the individual validation error messages for detailed client feedback.
 */
export class ValidationError extends AppError {
  public readonly errors?: string[];

  /**
   * Creates an instance of ValidationError.
   *
   * @param message - Single error message or array of error messages
   */
  constructor(message: string | string[]) {
    const errorMessage = Array.isArray(message) ? message.join(", ") : message;

    super(errorMessage, 400);

    if (Array.isArray(message)) {
      this.errors = message;
    }
  }
}
