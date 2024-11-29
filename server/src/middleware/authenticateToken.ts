import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
<<<<<<< HEAD
    if (!token) {
      res.sendStatus(401);
    } else {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      (req as any).user = decodedToken;
      next();
    }
  } catch (error) {
    res.sendStatus(403);
=======
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ msg: "Authentication required" });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    res.status(403).json({ msg: "Invalid token" });
>>>>>>> 7519692 (Add resfresh endpoint)
  }
};

export default authenticateToken;
