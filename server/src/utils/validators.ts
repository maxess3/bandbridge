import { MusicGenre } from "../generated/client";
import { ValidationError } from "../errors";

/**
 * Validates that all genre strings are valid MusicGenre enum values.
 *
 * @param genres - Array of genre strings to validate
 * @throws {ValidationError} If any genre is invalid
 *
 * @example
 * ```typescript
 * validateMusicGenres(["ROCK", "JAZZ"]); // OK
 * validateMusicGenres(["INVALID"]); // Throws ValidationError
 * ```
 */
export function validateMusicGenres(genres: string[]): void {
	// Vérification de sécurité : s'assurer que genres est un array
	if (!Array.isArray(genres)) {
		throw new ValidationError("Genres must be an array");
	}

	const validGenres = Object.values(MusicGenre);
	const invalidGenres = genres.filter(
		(genre) => !validGenres.includes(genre as MusicGenre)
	);

	if (invalidGenres.length > 0) {
		throw new ValidationError(
			`Invalid music genres: ${invalidGenres.join(", ")}`
		);
	}
}
