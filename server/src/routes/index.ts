import { Router } from "express";
import AuthRoutes from "./AuthRoutes";
import ProfileRoutes from "./ProfileRoutes";
import UserRoutes from "./UserRoutes";
import PostRoutes from "./PostRoutes";
import SettingsRoutes from "./SettingsRoutes";
import authenticateToken from "../middleware/authenticateToken";

const router = Router();

router.use("/api/auth", AuthRoutes);

router.use("/api/profile", ProfileRoutes);

router.use("/api/user", authenticateToken, UserRoutes);

router.use("/api/post", authenticateToken, PostRoutes);

router.use("/api/settings", authenticateToken, SettingsRoutes);

export default router;
