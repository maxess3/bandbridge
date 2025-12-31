export function getImageUrl(
  pictureKey: string,
  size: "thumbnail" | "small" | "medium" | "large"
) {
  // Early return si pas de clé
  if (!pictureKey) return null;

  // Validation de l'URL de base
  const baseUrl = process.env.NEXT_PUBLIC_R2_URL;
  if (!baseUrl) {
    console.warn("NEXT_PUBLIC_R2_URL is not defined");
    return null;
  }

  try {
    // Get the base key of the picture
    const keyBase = pictureKey.substring(0, pictureKey.lastIndexOf("-"));

    // Return the picture url
    return `${baseUrl}/${keyBase}-${size}.webp`;
  } catch (error) {
    console.error("Error parsing pictureKey:", error);
    return null;
  }
}

const profileRoleTranslations: Record<string, string> = {
  musician: "musicien",
};

export function translateProfileRole(role: string): string {
  return profileRoleTranslations[role.toLowerCase()] || role;
}
