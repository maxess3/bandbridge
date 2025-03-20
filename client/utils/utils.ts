export function getAgeFromTimestamp(timestamp: string): number {
  const birthDate = new Date(timestamp);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // Ajustement si l'anniversaire n'est pas encore passé cette année
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

export function capitalizeFirstLetterOnly(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const profileRoleTranslations: Record<string, string> = {
  musician: "musicien",
};

export function translateProfileRole(role: string): string {
  return profileRoleTranslations[role.toLowerCase()] || role;
}
