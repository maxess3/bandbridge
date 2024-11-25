import { Router } from "express";
import AuthRoutes from "./AuthRoutes.js";
import UserRoutes from "./UserRoutes.js";
import PostRoutes from "./PostRoutes.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = Router();

router.use("/api/auth", AuthRoutes);

router.use("/api/user", UserRoutes);

router.use("/api/post", authenticateToken, PostRoutes);

export default router;
