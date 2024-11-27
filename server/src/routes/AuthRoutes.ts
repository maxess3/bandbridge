import { Router, Request, Response } from "express";
import { signup, login } from "../Controller/AuthController";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  await signup(req, res);
});

router.post("/login", async (req: Request, res: Response) => {
  await login(req, res);
});

export default router;
