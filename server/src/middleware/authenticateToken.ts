import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!token) {
      res.status(401).json({ message: "Authentication required" });
    }

    if (!secret) {
      throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }

    const decodedToken = jwt.verify(token, secret);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

export default authenticateToken;
