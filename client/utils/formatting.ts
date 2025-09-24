export function getAgeFromTimestamp(timestamp: string): number {
  const birthDate = new Date(timestamp);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // Adjustment if the birthday hasn't passed this year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

export function capitalizeFirstLetterOnly(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function formatDateToMonthYear(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Vérifier si la date est valide
  if (isNaN(date.getTime())) return "";

  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];

  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${year}`;
}
