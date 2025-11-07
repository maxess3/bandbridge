/**
 * Classe de base pour toutes les erreurs de l'application
 * Permet de distinguer les erreurs opérationnelles des erreurs techniques
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintient le stack trace pour le debugging
    Error.captureStackTrace(this, this.constructor);

    // Définit le nom de la classe
    this.name = this.constructor.name;
  }
}
