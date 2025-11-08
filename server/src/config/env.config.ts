import { z } from "zod";

/**
 * Validation schema for environment variables.
 * The server will not start if a required variable is missing.
 */
const envSchema = z.object({
  // Server configuration
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .prefault("development"),
  PORT: z.string().prefault("5000"),

  // URLs
  CLIENT_URL: z.url("CLIENT_URL must be a valid URL"),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // JWT tokens
  ACCESS_TOKEN_SECRET: z
    .string()
    .min(32, "ACCESS_TOKEN_SECRET must contain at least 32 characters"),
  REFRESH_TOKEN_SECRET: z
    .string()
    .min(32, "REFRESH_TOKEN_SECRET must contain at least 32 characters"),
  FORGOT_TOKEN_SECRET: z
    .string()
    .min(32, "FORGOT_TOKEN_SECRET must contain at least 32 characters"),

  // Email configuration
  EMAIL_USER: z.email("EMAIL_USER must be a valid email address"),
  EMAIL_PWD: z.string().min(1, "EMAIL_PWD is required"),

  // R2/S3 configuration (Cloudflare R2)
  R2_ENDPOINT: z.url("R2_ENDPOINT must be a valid URL"),
  R2_ACCESS_KEY_ID: z.string().min(1, "R2_ACCESS_KEY_ID is required"),
  R2_SECRET_ACCESS_KEY: z.string().min(1, "R2_SECRET_ACCESS_KEY is required"),
  R2_BUCKET_NAME: z.string().min(1, "R2_BUCKET_NAME is required"),
});

/**
 * Validates and returns typed environment variables.
 * Throws an error if a required variable is missing or invalid.
 *
 * @returns Validated and typed environment variables
 *
 * @remarks
 * This function will exit the process if validation fails.
 * Should be called at application startup.
 */
export function validateEnv() {
  try {
    // Use safeParse with default values
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
      const missingVars = parsed.error.issues
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");
      console.error(
        "❌ Environment variable configuration error:\n",
        missingVars
      );
      console.error(
        "\n💡 Make sure all required variables are defined in your .env file"
      );
      process.exit(1);
    }

    return parsed.data;
  } catch (error) {
    console.error("❌ Error validating environment variables:", error);
    process.exit(1);
  }
}

/**
 * Validated and typed environment variables.
 * Use this constant instead of process.env directly.
 *
 * @remarks
 * This constant is initialized at module load time.
 * All environment variables are validated and typed.
 */
export const env = validateEnv();
