import { Router } from "express";
import authenticateToken from "../middleware/authenticateToken";
import { validateSchema } from "../middleware/validateSchema";
import upload from "../middleware/multerUpload";
import { formGeneralProfile, formSocialProfile } from "../lib/schema";
import * as ProfileController from "../Controller/ProfileController";
const router = Router();

router.get("/me", authenticateToken, ProfileController.getProfileOwner);

router.put(
	"/me",
	authenticateToken,
	validateSchema(formGeneralProfile),
	ProfileController.updateGeneralProfileOwner
);

router.put(
	"/me/social",
	authenticateToken,
	validateSchema(formSocialProfile),
	ProfileController.updateSocialProfileOwner
);

router.post(
	"/me/picture",
	authenticateToken,
	upload.single("file"),
	ProfileController.uploadProfilePicture
);

router.delete(
	"/me/picture",
	authenticateToken,
	ProfileController.deleteProfilePicture
);

router.post(
	"/follow/:targetUsername",
	authenticateToken,
	ProfileController.follow
);

router.post(
	"/unfollow/:targetUsername",
	authenticateToken,
	ProfileController.unfollow
);

router.get(
	"/following/:targetUsername",
	authenticateToken,
	ProfileController.isFollowing
);

router.get("/:username", ProfileController.getProfilePublic);

export default router;
