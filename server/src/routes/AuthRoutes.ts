import { rateLimit } from "express-rate-limit";

import { Router, Request, Response } from "express";
import {
	signup,
	login,
	refresh,
	logout,
	forgotPassword,
	resetPassword,
} from "../Controller/AuthController";

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	limit: 10, // each IP can make up to 10 requests per `windowsMs` (5 minutes)
	standardHeaders: true, // add the `RateLimit-*` headers to the response
	legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
	message: "Trop de requêtes, veuillez réessayer dans 5 minutes.",
});

const router = Router();

router.post("/signup", limiter, (req: Request, res: Response) => {
	signup(req, res);
});

router.post("/login", limiter, (req: Request, res: Response) => {
	login(req, res);
});

router.get("/refresh", (req: Request, res: Response) => {
	refresh(req, res);
});

router.get("/logout", (req: Request, res: Response) => {
	logout(req, res);
});

router.post("/forgot-password", limiter, (req: Request, res: Response) => {
	forgotPassword(req, res);
});

router.post("/reset-password", limiter, (req: Request, res: Response) => {
	resetPassword(req, res);
});

export default router;
