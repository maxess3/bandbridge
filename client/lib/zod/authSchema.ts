import z from "zod";

/**
 * Authentication schemas for user registration, login, and password management.
 */

/**
 * Schema for user registration.
 */
export const formSignUpSchema = z.object({
  email: z.email("Adresse email invalide"),
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
  email: z.email("Adresse email invalide"),
  password: z
    .string()
    .min(1, "le mot de passe est requis")
    .regex(/^[^\s]*$/, "Le mot de passe ne doit pas contenir d'espace"),
});

/**
 * Schema for forgot password request.
 */
export const formForgotPwdSchema = z.object({
  email: z.email("Adresse email invalide"),
});

/**
 * Schema for password reset.
 * Validates that password and confirmation match.
 */
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
    path: ["confirm"],
    error: "Les mots de passe doivent correspondre",
  });
