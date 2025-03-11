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
});

export const formLoginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z
    .string()
    .min(1, "Mot de passe requis")
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

/* EDIT PROFILE SCHEMA */

export const formBasicInfoProfile = z.object({
  firstname: z
    .string()
    .min(1, "Le prénom est requis")
    .regex(
      /^[a-zA-ZÀ-ÿ\-]+$/,
      "Le prénom ne doit contenir que des lettres et tirets"
    ),
  username: z
    .string()
    .min(5, "Le nom d'utilisateur doit contenir au moins 5 caractères")
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
  gender: z.enum(["other", "male", "female"], {
    errorMap: () => ({
      message: "Merci de sélectionner un genre",
    }),
  }),
  country: z.enum(["france"], {
    errorMap: () => ({
      message: "L'application est disponible en france uniquement",
    }),
  }),
  zipcode: z
    .string()
    .regex(/^\d{5}$/, "Le code postal doit contenir exactement 5 chiffres")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .regex(
      /^[a-zA-ZÀ-ÿ\-]+$/,
      "La ville ne doit contenir que des lettres et tirets"
    )
    .optional()
    .or(z.literal("")),
});
