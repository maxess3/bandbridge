import { Router } from "express";
import { validateSchema } from "../middleware/validateSchema";
import { formGeneralProfile, formSocialProfile } from "../lib/schema";
import * as ProfileController from "../Controller/ProfileController";

const router = Router();

router.get("/", ProfileController.getProfile);

router.put(
  "/",
  validateSchema(formGeneralProfile),
  ProfileController.updateGeneralProfile
);

router.put(
  "/social",
  validateSchema(formSocialProfile),
  ProfileController.updateSocialProfile
);

export default router;
