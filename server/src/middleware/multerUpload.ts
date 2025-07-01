import multer from "multer";

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB max file size
	},
	fileFilter: (req, file, cb) => {
		// Check if it's an image file
		if (!file.mimetype.startsWith("image/")) {
			cb(new Error("Seules les images sont autorisées"));
			return;
		}

		// Check for specific allowed extensions
		const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
		const fileExtension = file.originalname.toLowerCase().split(".").pop();

		if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
			cb(new Error("Seuls les formats JPG, JPEG, PNG et WebP sont autorisés"));
			return;
		}

		cb(null, true);
	},
});

export default upload;
