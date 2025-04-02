// Formats the name by capitalizing the first letter and converting the rest to lowercase
export const formatName = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export async function generateUniqueUsername(
  baseUsername: string,
  prisma: any
) {
  // Clean username (remove special chars)
  let username = baseUsername
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

  // Ensure minimum 5 characters by padding with random letters if needed
  while (username.length < 5) {
    username += String.fromCharCode(97 + Math.floor(Math.random() * 26));
  }

  // Generate a random 6-digit number
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const finalUsername = `${username}${randomNum}`;

  // Check if username already exists
  const existingProfile = await prisma.profile.findFirst({
    where: { username: finalUsername },
  });

  if (!existingProfile) {
    return finalUsername;
  }

  // If username exists, try again with a new random number
  return generateUniqueUsername(baseUsername, prisma);
}
