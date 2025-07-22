import z from "zod";

/* AUTH SCHEMA */

export const formSignUpSchema = z.object({
	email: z.string().email("Adresse email invalide"),
	password: z
		.string()
		.min(8, "Le mot de passe doit contenir au moins 8 caractères")
		.regex(
			/[\W_]/,
			"Le mot de passe doit contenir au moins un caractère spécial"
		)
		.regex(/^[^\s]*$/, "Le mot de passe ne doit pas contenir d'espace"),
	firstName: z
		.string()
		.min(1, "Le prénom est requis")
		.regex(
			/^[a-zA-ZÀ-ÿ\-]+$/,
			"Le prénom ne doit contenir que des lettres et tirets"
		),
	lastName: z
		.string()
		.min(1, "Le nom est requis")
		.regex(
			/^[a-zA-ZÀ-ÿ\-]+$/,
			"Le nom ne doit contenir que des lettres et tirets"
		),
});

export const formLoginSchema = z.object({
	email: z.string().email("Adresse email invalide"),
	password: z
		.string()
		.min(1, "le mot de passe est requis")
		.regex(/^[^\s]*$/, "Le mot de passe ne doit pas contenir d'espace"),
});

export const formForgotPwdSchema = z.object({
	email: z.string().email("Adresse email invalide"),
});

export const formResetPwdSchema = z
	.object({
		password: z
			.string()
			.min(8, "Le mot de passe doit contenir au moins 8 caractères")
			.regex(
				/[\W_]/,
				"Le mot de passe doit contenir au moins un caractère spécial"
			)
			.regex(/^[^\s]*$/, "Le mot de passe ne doit pas contenir d'espace"),
		confirm: z.string(),
	})
	.refine((data) => data.password === data.confirm, {
		message: "Les mots de passe doivent correspondre",
		path: ["confirm"],
	});

/* INSTRUMENT SCHEMA */

export const instrumentSchema = z.object({
	instrumentTypeId: z.string().min(1, "L'instrument est requis"),
	level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "PROFESSIONAL"], {
		errorMap: () => ({
			message: "Merci de sélectionner un niveau",
		}),
	}),
	order: z.number().min(0, "L'ordre doit être d'au moins 0").optional(),
});

/* EDIT PROFILE SCHEMA */

export const formGeneralProfile = z.object({
	firstname: z
		.string()
		.min(1, "Le prénom est requis")
		.max(25, "Le prénom ne doit pas dépasser 25 caractères")
		.regex(
			/^[a-zA-ZÀ-ÿ\-]+$/,
			"Le prénom ne doit contenir que des lettres et tirets"
		),
	lastname: z
		.string()
		.min(1, "Le nom est requis")
		.max(30, "Le nom ne doit pas dépasser 30 caractères")
		.regex(
			/^[a-zA-ZÀ-ÿ\-]+$/,
			"Le nom ne doit contenir que des lettres et tirets"
		),
	username: z
		.string()
		.min(5, "Le nom d'utilisateur doit contenir au moins 5 caractères")
		.max(20, "Le nom d'utilisateur ne doit pas dépasser 20 caractères")
		.regex(
			/^[a-zA-Z0-9]+$/,
			"Le nom d'utilisateur ne doit contenir que des lettres et des chiffres"
		)
		.transform((username) => username.trim().toLowerCase()),
	birthdate: z
		.object({
			day: z.string().regex(/^(0?[1-9]|[12][0-9]|3[01])$/, "Jour invalide"),
			month: z.string().regex(/^(0?[1-9]|1[012])$/, "Mois invalide"),
			year: z
				.string()
				.regex(/^\d{4}$/, "Année invalide")
				.refine((year) => {
					const currentYear = new Date().getFullYear();
					const yearNum = parseInt(year);
					return yearNum <= currentYear - 18 && yearNum >= currentYear - 120;
				}, "L'âge doit être compris entre 18 et 120 ans"),
		})
		.strip(),
	formattedBirthdate: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, "Merci d'entrer une date de naissance valide")
		.refine((date) => {
			const [year, month, day] = date.split("-").map(Number);
			const isValidDate =
				new Date(year, month - 1, day).getFullYear() === year &&
				new Date(year, month - 1, day).getMonth() === month - 1 &&
				new Date(year, month - 1, day).getDate() === day;
			return isValidDate;
		}, "Merci d'entrer une date de naissance valide")
		.refine((date) => {
			const birthDate = new Date(date);
			const today = new Date();
			return birthDate <= today;
		}, "Merci d'entrer une date de naissance valide")
		.refine((date) => {
			const birthYear = parseInt(date.split("-")[0]);
			const currentYear = new Date().getFullYear();
			return currentYear - birthYear >= 18;
		}, "Vous devez avoir au moins 18 ans")
		.refine((date) => {
			const birthYear = parseInt(date.split("-")[0]);
			const currentYear = new Date().getFullYear();
			return currentYear - birthYear <= 120;
		}, "Merci d'entrer une date de naissance valide"),
	gender: z.enum(["OTHER", "MALE", "FEMALE"], {
		errorMap: () => ({
			message: "Merci de sélectionner un genre",
		}),
	}),
	country: z.enum(["France"], {
		errorMap: () => ({
			message: "L'application est disponible en france uniquement",
		}),
	}),
	zipcode: z
		.string()
		.min(1, "Le code postal est requis")
		.regex(/^\d{5}$/, "Le code postal doit contenir exactement 5 chiffres"),
	city: z
		.string()
		.min(1, "La ville est requise")
		.max(50, "La ville ne doit pas dépasser 50 caractères")
		.regex(
			/^[a-zA-ZÀ-ÿ\-']+$/,
			"La ville ne doit contenir que des lettres et tirets"
		),
	instruments: z
		.array(instrumentSchema)
		.min(0, "Le nombre d'instruments ne peut pas être négatif")
		.max(10, "Vous ne pouvez pas ajouter plus de 10 instruments")
		.refine(
			(instruments) => {
				// Vérifier qu'il n'y a pas de doublons d'instruments
				const instrumentIds = instruments
					.filter((instrument) => instrument.instrumentTypeId) // Filtrer les instruments vides
					.map((instrument) => instrument.instrumentTypeId);
				const uniqueIds = new Set(instrumentIds);
				return uniqueIds.size === instrumentIds.length;
			},
			{
				message: "Vous ne pouvez pas ajouter le même instrument plusieurs fois",
			}
		),
});

export const formInfoProfile = z.object({
	description: z
		.string()
		.max(2600, "La description ne doit pas dépasser 2600 caractères")
		.transform((val) => {
			// Nettoyer les sauts de lignes multiples (2 ou plus) en un seul saut de ligne
			return val ? val.replace(/\n{3,}/g, "\n") : val;
		})
		.optional(),
	concertsPlayed: z.enum(
		[
			"NOT_SPECIFIED",
			"LESS_THAN_10",
			"TEN_TO_FIFTY",
			"FIFTY_TO_HUNDRED",
			"MORE_THAN_HUNDRED",
		],
		{
			errorMap: () => ({
				message: "Merci de sélectionner une option",
			}),
		}
	),
	rehearsalsPerWeek: z.enum(
		[
			"NOT_SPECIFIED",
			"ONCE_PER_WEEK",
			"TWO_TO_THREE_PER_WEEK",
			"MORE_THAN_THREE_PER_WEEK",
		],
		{
			errorMap: () => ({
				message: "Merci de sélectionner une option",
			}),
		}
	),
	practiceType: z.enum(["NOT_SPECIFIED", "HOBBY", "ACTIVE"], {
		errorMap: () => ({
			message: "Merci de sélectionner une option",
		}),
	}),
	youtube: z
		.string()
		.trim()
		.optional()
		.refine(
			(val) => !val || val.startsWith("https://www.youtube.com/"),
			'L\'URL doit commencer par "https://www.youtube.com/"'
		),
	instagram: z
		.string()
		.trim()
		.optional()
		.refine(
			(val) => !val || val.startsWith("https://www.instagram.com/"),
			'L\'URL doit commencer par "https://www.instagram.com/"'
		),
	tiktok: z
		.string()
		.trim()
		.optional()
		.refine(
			(val) => !val || val.startsWith("https://www.tiktok.com/"),
			'L\'URL doit commencer par "https://www.tiktok.com/"'
		),
	twitter: z
		.string()
		.trim()
		.optional()
		.refine(
			(val) => !val || val.startsWith("https://x.com/"),
			'L\'URL doit commencer par "https://x.com/"'
		),
	soundcloud: z
		.string()
		.trim()
		.optional()
		.refine(
			(val) => !val || val.startsWith("https://soundcloud.com/"),
			'L\'URL doit commencer par "https://soundcloud.com/"'
		),
});

export const formProfilePicture = z.object({
	profilePicture: z
		.instanceof(File, { message: "Le fichier est requis" })
		.refine((file) => file.type.startsWith("image/"), {
			message: "Le fichier doit être une image",
		})
		.refine((file) => file.size <= 5 * 1024 * 1024, {
			message: "L'image ne doit pas dépasser 5 Mo",
		})
		.refine(
			(file) => {
				const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
				return allowedTypes.includes(file.type);
			},
			{
				message: "Format d'image non supporté (JPEG, PNG, WebP uniquement)",
			}
		),
});
