import { rateLimit } from "express-rate-limit";

import { Router, Request, Response } from "express";
import {
  signup,
  login,
  google,
  refreshToken,
  forgotPassword,
  resetPassword,
  validateResetToken,
} from "../Controller/AuthController";

const LoginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 10, // each IP can make up to 10 requests per `windowsMs` (5 minutes)
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
  message: "Trop de requêtes, veuillez réessayer dans 5 minutes.",
});

const ForgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // each IP can make up to 5 requests per `windowsMs` (15 minutes)
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
  message: "Trop de requêtes, veuillez réessayer dans 5 minutes.",
});

const router = Router();

router.post("/signup", (req: Request, res: Response) => {
  signup(req, res);
});

router.post("/login", LoginLimiter, (req: Request, res: Response) => {
  login(req, res);
});

router.post("/google-login", (req: Request, res: Response) => {
  google(req, res);
});

router.post("/refresh", (req: Request, res: Response) => {
  refreshToken(req, res);
});

router.post(
  "/forgot-password",
  ForgotPasswordLimiter,
  (req: Request, res: Response) => {
    forgotPassword(req, res);
  }
);

router.post("/reset-password", (req: Request, res: Response) => {
  resetPassword(req, res);
});

router.get("/validate-reset-token", (req: Request, res: Response) => {
  validateResetToken(req, res);
});

export default router;
