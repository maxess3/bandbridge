// Traductions des genres musicaux
export const genreTranslations: Record<string, string> = {
	ROCK: "Rock",
	JAZZ: "Jazz",
	ELECTRO: "Électro",
	POP: "Pop",
	FOLK: "Folk",
	BLUES: "Blues",
	HIP_HOP: "Hip-Hop",
	RAP: "Rap",
	R_AND_B: "R&B",
	METAL: "Metal",
	PUNK: "Punk",
	COUNTRY: "Country",
	REGGAE: "Reggae",
	FUNK: "Funk",
	SOUL: "Soul",
	ALTERNATIVE: "Alternative",
	INDIE: "Indie",
	ACOUSTIC: "Acoustique",
	LATINO: "Latino",
	CLASSICAL: "Classique",
	CELTIC: "Celtique",
	SKA: "Ska",
	LOUNGE: "Lounge",
	RELIGIOUS: "Religieux",
	OTHER: "Autre",
};

// Fonction utilitaire pour traduire un nom de genre
export const translateGenre = (name: string): string => {
	return genreTranslations[name] || name;
};
