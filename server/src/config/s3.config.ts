import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env.config";

/**
 * Singleton instance of S3Client for Cloudflare R2.
 * Reused across the application to avoid creating multiple clients.
 */
let s3Client: S3Client | null = null;

/**
 * Gets or creates the S3 client instance.
 * Uses singleton pattern to ensure only one client is created.
 *
 * @returns S3Client instance configured for Cloudflare R2
 *
 * @remarks
 * The client is configured with:
 * - Region: "auto" (required for Cloudflare R2)
 * - Endpoint: From R2_ENDPOINT environment variable
 * - Credentials: From R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY
 */
export function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region: "auto",
      endpoint: env.R2_ENDPOINT,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    });
  }

  return s3Client;
}
