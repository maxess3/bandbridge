import { Badge } from "@/components/ui/badge";
import { translateGenre } from "@/utils/translations/genreTranslations";

export const ProfileMusicGenres = ({ genres }: { genres?: string[] }) => {
	if (!genres || genres.length === 0) return null;

	const translatedGenres = genres.map((genre) => translateGenre(genre));

	return (
		<div className="flex flex-wrap gap-2">
			{translatedGenres.map((genre) => (
				<Badge
					key={genre}
					className="border-primary text-primary"
					variant="outline"
				>
					{genre}
				</Badge>
			))}
		</div>
	);
};
