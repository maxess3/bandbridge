/**
 * Base class for all application errors.
 * Allows distinguishing between operational errors and technical errors.
 *
 * @remarks
 * All custom errors should extend this class.
 * Operational errors are expected errors (validation, not found, etc.),
 * while technical errors are bugs or system errors.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  /**
   * Creates an instance of AppError.
   *
   * @param message - Error message
   * @param statusCode - HTTP status code (default: 500)
   * @param isOperational - Whether this is an operational error (default: true)
   */
  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains stack trace for debugging
    Error.captureStackTrace(this, this.constructor);

    // Sets the class name
    this.name = this.constructor.name;
  }
}
