export function getProfileImageUrl(
  profilePictureKey: string,
  size: "thumbnail" | "small" | "medium" | "large"
) {
  // Early return si pas de clé
  if (!profilePictureKey) return null;

  // Validation de l'URL de base
  const baseUrl = process.env.NEXT_PUBLIC_R2_URL;
  if (!baseUrl) {
    console.warn("NEXT_PUBLIC_R2_URL is not defined");
    return null;
  }

  try {
    // Get the base key of the profile picture
    const oldKey = profilePictureKey;
    const oldKeyBase = oldKey.substring(0, oldKey.lastIndexOf("-"));

    // Return the profile picture url
    return `${baseUrl}/${oldKeyBase}-${size}.webp`;
  } catch (error) {
    console.error("Error parsing profilePictureKey:", error);
    return null;
  }
}

const profileRoleTranslations: Record<string, string> = {
  musician: "musicien",
};

export function translateProfileRole(role: string): string {
  return profileRoleTranslations[role.toLowerCase()] || role;
}
