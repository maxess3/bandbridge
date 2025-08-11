import z from "zod";

/* USER SETTINGS SCHEMA */

export const formUserSettings = z.object({
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
});
