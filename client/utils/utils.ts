export function isPublicRoute(pathname: string): boolean {
	const PUBLIC_LAYOUT_ROUTES = ["/articles"];
	return PUBLIC_LAYOUT_ROUTES.some((route) => pathname.startsWith(route));
}

export function getProfileImageUrl(
	profilePictureKey: string,
	size: "thumbnail" | "small" | "medium" | "large"
) {
	// Get the base key of the profile picture
	const oldKey = profilePictureKey;
	const oldKeyBase = oldKey.substring(0, oldKey.lastIndexOf("-"));

	// Return the profile picture url
	return `${process.env.NEXT_PUBLIC_R2_URL}/${oldKeyBase}-${size}.webp`;
}

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

const profileRoleTranslations: Record<string, string> = {
	musician: "musicien",
};

export function translateProfileRole(role: string): string {
	return profileRoleTranslations[role.toLowerCase()] || role;
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
