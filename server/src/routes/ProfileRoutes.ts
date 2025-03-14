import { Router } from "express";
import { validateSchema } from "../middleware/validateSchema";
import { formBasicInfoProfile } from "../lib/schema";
import * as ProfileController from "../Controller/ProfileController";

const router = Router();

router.put(
  "/",
  validateSchema(formBasicInfoProfile),
  ProfileController.updateProfile
);

export default router;
