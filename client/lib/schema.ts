import z from "zod";

const europeDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

/* Auth schema */

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
      /^[a-zA-Z]+$/,
      "Le prénom ne doit contenir que des lettres sans espace"
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

/* Edit profile schema */

export const formBasicInfoProfile = z.object({
  firstName: z
    .string()
    .min(1, "Le prénom est requis")
    .regex(
      /^[a-zA-Z]+$/,
      "Le prénom ne doit contenir que des lettres sans espace"
    ),
  username: z
    .string()
    .min(5, "Le nom d'utilisateur doit contenir au moins 5 caractères")
    .transform((username) => username.trim().toLowerCase()),
  birthdate: z
    .string()
    .refine((date) => europeDateRegex.test(date), {
      message: "La date doit être au format DD/MM/YYYY",
    })
    .refine(
      (date) => {
        const [day, month, year] = date.split("/").map(Number);
        const dateObj = new Date(year, month - 1, day);
        return (
          dateObj.getDate() === day &&
          dateObj.getMonth() === month - 1 &&
          dateObj.getFullYear() === year
        );
      },
      {
        message: "La date n'est pas valide",
      }
    ),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({
      message: "Le genre doit être défini sur Homme, Femme ou Autre",
    }),
  }),
  country: z.string(),
  city: z.string(),
  zipCode: z.number(),
});
