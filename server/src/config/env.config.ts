import { z } from "zod";

/**
 * Schéma de validation pour les variables d'environnement
 * Le serveur ne démarrera pas si une variable requise est manquante
 */
const envSchema = z.object({
  // Configuration serveur
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("5000"),

  // URLs
  CLIENT_URL: z.string().url("CLIENT_URL doit être une URL valide"),

  // Base de données
  DATABASE_URL: z.string().min(1, "DATABASE_URL est requis"),

  // Tokens JWT
  ACCESS_TOKEN_SECRET: z
    .string()
    .min(32, "ACCESS_TOKEN_SECRET doit contenir au moins 32 caractères"),
  REFRESH_TOKEN_SECRET: z
    .string()
    .min(32, "REFRESH_TOKEN_SECRET doit contenir au moins 32 caractères"),
  FORGOT_TOKEN_SECRET: z
    .string()
    .min(32, "FORGOT_TOKEN_SECRET doit contenir au moins 32 caractères"),

  // Configuration email
  EMAIL_USER: z.string().email("EMAIL_USER doit être une adresse email valide"),
  EMAIL_PWD: z.string().min(1, "EMAIL_PWD est requis"),

  // Configuration R2/S3 (Cloudflare R2)
  R2_ENDPOINT: z.string().url("R2_ENDPOINT doit être une URL valide"),
  R2_ACCESS_KEY_ID: z.string().min(1, "R2_ACCESS_KEY_ID est requis"),
  R2_SECRET_ACCESS_KEY: z.string().min(1, "R2_SECRET_ACCESS_KEY est requis"),
  R2_BUCKET_NAME: z.string().min(1, "R2_BUCKET_NAME est requis"),
});

/**
 * Valide et retourne les variables d'environnement typées
 * Lance une erreur si une variable requise est manquante ou invalide
 */
export function validateEnv() {
  try {
    // Utiliser parseAsync avec les valeurs par défaut
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
      const missingVars = parsed.error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");
      console.error(
        "❌ Erreur de configuration des variables d'environnement:\n",
        missingVars
      );
      console.error(
        "\n💡 Assurez-vous que toutes les variables requises sont définies dans votre fichier .env"
      );
      process.exit(1);
    }

    return parsed.data;
  } catch (error) {
    console.error(
      "❌ Erreur lors de la validation des variables d'environnement:",
      error
    );
    process.exit(1);
  }
}

/**
 * Variables d'environnement validées et typées
 * Utiliser cette constante au lieu de process.env directement
 */
export const env = validateEnv();
