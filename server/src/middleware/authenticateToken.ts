import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { env } from "../config/env.config";
import { UnauthorizedError } from "../errors";

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
