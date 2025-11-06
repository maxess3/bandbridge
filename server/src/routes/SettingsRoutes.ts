import { Router } from "express";
import { validateBodySchema } from "../middleware/validateSchema";
import { formUserSettings } from "../lib/zod";
import * as SettingsController from "../controllers/SettingsController";

const router = Router();

// Route pour récupérer les paramètres utilisateur
router.get("/user-settings", SettingsController.getUserSettings);

// Route pour mettre à jour les paramètres utilisateur
router.put(
  "/user-settings",
  validateBodySchema(formUserSettings),
  SettingsController.updateUserSettings
);

export default router;
