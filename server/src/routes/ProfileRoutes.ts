import { Router } from "express";
import authenticateToken from "../middleware/authenticateToken";
import { validateSchema } from "../middleware/validateSchema";
import upload, { handleMulterError } from "../middleware/multerUpload";
import { formGeneralProfile, formInfoProfile } from "../lib/zod";
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
	"/me/info",
	authenticateToken,
	validateSchema(formInfoProfile),
	ProfileController.updateInfoProfileOwner
);

router.post(
	"/me/picture",
	authenticateToken,
	upload.single("file"),
	handleMulterError, // Ajouter ce middleware pour gérer les erreurs Multer
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

router.get("/instruments", ProfileController.getInstrumentTypes);

router.get("/genres", ProfileController.getMusicGenres);

router.get("/:username", ProfileController.getProfilePublic);

router.get("/:username/followers", ProfileController.getFollowersList);

router.get("/:username/following", ProfileController.getFollowingList);

export default router;
