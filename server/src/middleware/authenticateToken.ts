import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      res.sendStatus(401); // No token provided
    } else {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      (req as any).user = decodedToken;
      next();
    }
  } catch (error) {
    res.sendStatus(403); // Token provided but invalid or expired
  }
};

export default authenticateToken;
