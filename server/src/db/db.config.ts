import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/client";
import { env } from "../config/env.config";

/**
 * Prisma client instance configured for the application.
 *
 * @remarks
 * Logging is configured based on environment:
 * - Production: Only errors (for performance)
 * - Development/Test: All logs (query, info, warn, error)
 */

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
  adapter,
  log:
    env.NODE_ENV === "production"
      ? ["error"] // Only errors in production (performance)
      : ["query", "info", "warn", "error"], // All logs in development/test })
});

export default prisma;
