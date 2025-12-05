/**
 * Utilitaires pour la transformation de dates dans les formulaires
 */

export interface BirthdateFormValues {
  day: string;
  month: string;
  year: string;
}

/**
 * Transforme une date ISO string en format formulaire (day, month, year)
 */
export function formatBirthdateForForm(
  birthDate: string | null
): BirthdateFormValues {
  if (!birthDate) {
    return { day: "", month: "", year: "" };
  }

  const date = new Date(birthDate);
  return {
    day: String(date.getUTCDate()).padStart(2, "0"),
    month: String(date.getUTCMonth() + 1).padStart(2, "0"),
    year: String(date.getUTCFullYear()),
  };
}

/**
 * Parse un objet birthdate depuis le formulaire vers une date ISO string
 */
export function parseBirthdateFromForm(
  birthdate: BirthdateFormValues
): string | null {
  if (!birthdate.day || !birthdate.month || !birthdate.year) {
    return null;
  }

  const date = new Date(
    Date.UTC(
      parseInt(birthdate.year, 10),
      parseInt(birthdate.month, 10) - 1,
      parseInt(birthdate.day, 10)
    )
  );

  return date.toISOString();
}
