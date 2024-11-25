import { Router } from "express";
import { createPost } from "../Controller/PostController.js";

const router = Router();

router.post("/", createPost);

export default router;
