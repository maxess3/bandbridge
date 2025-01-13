import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  try {
    if (!token) {
      res.sendStatus(401); // No token provided
    } else {
      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      );
      (req as any).user = decodedToken;
      next();
    }
  } catch (error) {
    res.sendStatus(403); // Invalid or expired token
  }
};

export default authenticateToken;
