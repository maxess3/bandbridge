import z from "zod";

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
  lastName: z
    .string()
    .min(1, "Le nom est requis")
    .regex(
      /^[a-zA-Z]+$/,
      "Le nom ne doit contenir que des lettres sans espace"
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
