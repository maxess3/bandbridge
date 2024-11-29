import { Router, Request, Response } from "express";
import { createPost } from "../Controller/PostController";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  createPost(req, res);
});

export default router;
