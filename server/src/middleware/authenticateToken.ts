import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { env } from "../config/env.config";
import { UnauthorizedError } from "../errors";

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
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  try {
    if (!token) {
      return next(new UnauthorizedError("No token provided"));
    } else {
      const decodedToken = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
      (req as any).user = decodedToken;
      next();
    }
  } catch (error) {
    return next(new UnauthorizedError("Invalid or expired token"));
  }
};

export default authenticateToken;
