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
			day: z.string().min(1, "Le jour est requis"),
			month: z.string().min(1, "Le mois est requis"),
			year: z.string().min(1, "L'année est requise"),
		})
		.refine((data) => {
			const { day, month, year } = data;
			if (!day || !month || !year) return false;

			const dayNum = parseInt(day);
			const monthNum = parseInt(month);
			const yearNum = parseInt(year);

			// Vérifier que c'est une date valide
			const date = new Date(yearNum, monthNum - 1, dayNum);
			return (
				date.getFullYear() === yearNum &&
				date.getMonth() === monthNum - 1 &&
				date.getDate() === dayNum
			);
		}, "Date de naissance invalide")
		.refine((data) => {
			const { day, month, year } = data;
			if (!day || !month || !year) return false;

			const birthDate = new Date(
				parseInt(year),
				parseInt(month) - 1,
				parseInt(day)
			);
			const today = new Date();
			return birthDate <= today;
		}, "La date de naissance ne peut pas être dans le futur")
		.refine((data) => {
			const { day, month, year } = data;
			if (!day || !month || !year) return false;

			const birthDate = new Date(
				parseInt(year),
				parseInt(month) - 1,
				parseInt(day)
			);
			const today = new Date();
			const age = today.getFullYear() - birthDate.getFullYear();
			const monthDiff = today.getMonth() - birthDate.getMonth();
			const dayDiff = today.getDate() - birthDate.getDate();

			// Ajuster l'âge si l'anniversaire n'est pas encore passé cette année
			const actualAge =
				monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

			return actualAge >= 18;
		}, "Vous devez avoir au moins 18 ans")
		.refine((data) => {
			const { day, month, year } = data;
			if (!day || !month || !year) return false;

			const birthDate = new Date(
				parseInt(year),
				parseInt(month) - 1,
				parseInt(day)
			);
			const today = new Date();
			const age = today.getFullYear() - birthDate.getFullYear();
			const monthDiff = today.getMonth() - birthDate.getMonth();
			const dayDiff = today.getDate() - birthDate.getDate();

			// Ajuster l'âge si l'anniversaire n'est pas encore passé cette année
			const actualAge =
				monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

			return actualAge <= 120;
		}, "L'âge maximum autorisé est de 120 ans"),
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
