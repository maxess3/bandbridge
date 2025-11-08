import { Router } from "express";
import { validateBodySchema } from "../middleware/validateSchema";
import { formUserSettings } from "../lib/zod";
import * as SettingsController from "../controllers/SettingsController";

const router = Router();

// Route to get user settings
router.get("/user-settings", SettingsController.getUserSettings);

// Route to update user settings
router.put(
  "/user-settings",
  validateBodySchema(formUserSettings),
  SettingsController.updateUserSettings
);

export default router;
