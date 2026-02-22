import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { env } from "../config/env.config";
import { UnauthorizedError } from "../errors";

/**
 * Extracts and verifies the JWT from the Authorization header.
 * Returns the decoded payload or null if absent/invalid.
 */
function getDecodedToken(req: Request): { userId: string; [key: string]: unknown } | null {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    return decoded as { userId: string; [key: string]: unknown };
  } catch {
    return null;
  }
}

/**
 * JWT authentication middleware.
 * Verifies the presence and validity of the token in the Authorization header.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 *
 * @remarks
 * The token must be provided in the Authorization header in the format "Bearer <token>".
 * If valid, adds the decoded token information to req.user.
 *
 * @throws {UnauthorizedError} If no token is provided or if the token is invalid/expired
 */
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const decoded = getDecodedToken(req);
  if (!decoded) {
    return next(new UnauthorizedError("Invalid or missing token"));
  }
  (req as any).user = decoded;
  next();
};

/**
 * Optional JWT authentication middleware.
 * If a valid token is present, attaches the decoded payload to req.user.
 * If absent or invalid, continues without setting req.user (no error).
 */
export const optionalAuthenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const decoded = getDecodedToken(req);
  if (decoded) {
    (req as any).user = decoded;
  }
  next();
};

export default authenticateToken;
