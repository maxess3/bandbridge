import { PrismaClient } from "@prisma/client";
import { env } from "../config/env.config";

const prisma = new PrismaClient({
  log:
    env.NODE_ENV === "production"
      ? ["error"] // Seulement les erreurs en production (performance)
      : ["query", "info", "warn", "error"], // Tous les logs en développement/test
});

export default prisma;
