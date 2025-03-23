import { Router } from "express";
import authenticateToken from "../middleware/authenticateToken";
import { validateSchema } from "../middleware/validateSchema";
import { formGeneralProfile, formSocialProfile } from "../lib/schema";
import * as ProfileController from "../Controller/ProfileController";

const router = Router();

router.get("/me", authenticateToken, ProfileController.getProfilePrivate);

router.put(
  "/me",
  authenticateToken,
  validateSchema(formGeneralProfile),
  ProfileController.updateGeneralProfilePrivate
);

router.put(
  "/me/social",
  authenticateToken,
  validateSchema(formSocialProfile),
  ProfileController.updateSocialProfilePrivate
);

router.get("/:username", ProfileController.getProfilePublic);

export default router;
