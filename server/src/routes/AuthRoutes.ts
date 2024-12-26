import { Router, Request, Response } from "express";
import {
	signup,
	login,
	refresh,
	logout,
	forgotPassword,
	resetPassword,
} from "../Controller/AuthController";

const router = Router();

router.post("/signup", (req: Request, res: Response) => {
	signup(req, res);
});

router.post("/login", (req: Request, res: Response) => {
	login(req, res);
});

router.get("/refresh", (req: Request, res: Response) => {
	refresh(req, res);
});

router.get("/logout", (req: Request, res: Response) => {
	logout(req, res);
});

router.get("/forgot-password", (req: Request, res: Response) => {
	forgotPassword(req, res);
});

router.post("/reset-password", (req: Request, res: Response) => {
	resetPassword(req, res);
});

export default router;
