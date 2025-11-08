import { PrismaClient } from "@prisma/client";
import { env } from "../config/env.config";

/**
 * Prisma client instance configured for the application.
 *
 * @remarks
 * Logging is configured based on environment:
 * - Production: Only errors (for performance)
 * - Development/Test: All logs (query, info, warn, error)
 */
const prisma = new PrismaClient({
  log:
    env.NODE_ENV === "production"
      ? ["error"] // Only errors in production (performance)
      : ["query", "info", "warn", "error"], // All logs in development/test
});

export default prisma;
