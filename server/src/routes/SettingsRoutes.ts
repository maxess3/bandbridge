import { Router } from "express";
import { validateSchema } from "../middleware/validateSchema";
import { formUserSettings } from "../lib/zod";
import * as SettingsController from "../Controller/SettingsController";

const router = Router();

// Route pour récupérer les paramètres utilisateur
router.get("/user-settings", SettingsController.getUserSettings);

// Route pour mettre à jour les paramètres utilisateur
router.put(
	"/user-settings",
	validateSchema(formUserSettings),
	SettingsController.updateUserSettings
);

export default router;
