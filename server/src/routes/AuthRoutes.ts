import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { validateBodySchema } from "../middleware/validateSchema";
import {
  formSignUpSchema,
  formForgotPwdSchema,
  formResetPwdSchema,
} from "../lib/zod";
import * as AuthController from "../controllers/AuthController";

const LoginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 10, // each IP can make up to 10 requests per `windowsMs` (5 minutes)
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
  message: "Too many requests, please try again in 5 minutes.",
});

const ForgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // each IP can make up to 5 requests per `windowsMs` (15 minutes)
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
  message: "Too many requests, please try again in 5 minutes.",
});

const router = Router();

router.post(
  "/signup",
  validateBodySchema(formSignUpSchema),
  AuthController.signup
);
router.post("/login", AuthController.login);
router.post("/google-login", AuthController.google);
router.post("/refresh", AuthController.refreshToken);
router.post(
  "/forgot-password",
  ForgotPasswordLimiter,
  validateBodySchema(formForgotPwdSchema),
  AuthController.forgotPassword
);
router.post(
  "/reset-password",
  validateBodySchema(formResetPwdSchema),
  AuthController.resetPassword
);
router.get("/validate-reset-token", AuthController.validateResetToken);

export default router;
