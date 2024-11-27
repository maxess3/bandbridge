import { Router, Request, Response } from "express";
import { createPost } from "../Controller/PostController";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  await createPost(req, res);
});

export default router;
