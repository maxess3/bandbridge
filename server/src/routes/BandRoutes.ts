import { Router } from "express";
import authenticateToken from "../middleware/authenticateToken";
import {
	validateBodySchema,
	validateQuerySchema,
} from "../middleware/validateSchema";
import upload, { handleMulterError } from "../middleware/multerUpload";
import { createBandApiSchema, allBandsQuerySchema } from "../lib/zod";
import * as BandController from "../controllers/BandController";

const router = Router();

router.post(
  "/create",
  authenticateToken,
  upload.single("bandPicture"), // Optional: handle image upload if provided
  handleMulterError,
  validateBodySchema(createBandApiSchema),
  BandController.createBand
);

router.get("/user-bands", authenticateToken, BandController.getUserBands);

router.get(
	"/all",
	validateQuerySchema(allBandsQuerySchema),
	BandController.getAllBands
);

export default router;
