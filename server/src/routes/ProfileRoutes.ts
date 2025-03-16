import { Router } from "express";
import { validateSchema } from "../middleware/validateSchema";
import { formBasicInfoProfile } from "../lib/schema";
import { formSocialProfile } from "../lib/schema";
import * as ProfileController from "../Controller/ProfileController";

const router = Router();

router.get("/", ProfileController.getProfile);

router.put(
  "/",
  validateSchema(formBasicInfoProfile),
  ProfileController.updateGeneralProfile
);

router.put(
  "/social-links",
  validateSchema(formSocialProfile),
  ProfileController.updateSocialLinks
);

export default router;
