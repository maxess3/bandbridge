import { FieldError } from "react-hook-form";

/**
 * Extrait le message d'erreur depuis un FieldError de react-hook-form
 * Gère les cas suivants :
 * - Erreurs simples : error?.message
 * - Erreurs imbriquées (arrays) : error?.root?.message || error?.message
 * - Erreurs string directes
 */
export function getErrorMessage(
  error?: FieldError | string | null
): string | undefined {
  if (!error) return undefined;

  // Si c'est une string directe
  if (typeof error === "string") return error;

  // Si c'est un FieldError, extraire le message
  // Pour les arrays (genres, instruments), l'erreur peut être dans root
  const message = error?.root?.message || error?.message;

  return message ? String(message) : undefined;
}
