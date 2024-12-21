import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      // No token provided, return 401 Unauthorized
      res.sendStatus(401);
    } else {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      (req as any).user = decodedToken;
      next();
    }
  } catch (error) {
    // Token provided but invalid or expired, return 403 Forbidden
    res.sendStatus(403);
  }
};

export default authenticateToken;
