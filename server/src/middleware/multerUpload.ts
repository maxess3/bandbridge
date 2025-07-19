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

// Middleware pour gérer les erreurs Multer
export const handleMulterError = (err: any, req: any, res: any, next: any) => {
	if (err instanceof multer.MulterError) {
		// Erreur de taille de fichier
		if (err.code === "LIMIT_FILE_SIZE") {
			return res.status(400).json({
				message: "Le fichier est trop volumineux. Taille maximum : 5 Mo",
			});
		}
		// Autres erreurs Multer
		return res.status(400).json({
			message: err.message || "Erreur lors de l'upload du fichier",
		});
	}

	// Erreurs personnalisées du fileFilter
	if (err.message) {
		return res.status(400).json({
			message: err.message,
		});
	}

	// Erreurs inconnues
	return res.status(500).json({
		message: "Erreur interne du serveur",
	});
};

export default upload;
