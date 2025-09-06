import { translateGenre } from "@/utils/translations/genreTranslations";

export const ProfileMusicGenres = ({ genres }: { genres?: string[] }) => {
  if (!genres || genres.length === 0) return null;

  const translatedGenres = genres.map((genre) => translateGenre(genre));

  return (
    <div className="flex flex-wrap gap-2 font-medium opacity-80 uppercase">
      {translatedGenres.map((genre, index) => (
        <span
          key={genre}
          className={`${
            index < translatedGenres.length - 1 ? "border-r" : ""
          }  ${index < translatedGenres.length - 1 ? "pr-2" : ""}`}
        >
          {genre}
        </span>
      ))}
    </div>
  );
};
