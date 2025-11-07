import { Router } from "express";
import { createPost } from "../controllers/PostController";

const router = Router();

router.post("/", createPost);

export default router;
