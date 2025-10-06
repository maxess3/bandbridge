import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus, Info } from "lucide-react";
import { GenreAutocomplete } from "@/components/features/profile/autocomplete";
import { GenreItem } from "./GenreItem";
import { useGenres } from "@/components/features/profile/forms/UpdateProfileGeneralForm/hooks/useGenres";
import { FormValues } from "../types/index";

interface GenresSectionProps {
  musicGenres: string[];
  isLoadingGenres: boolean;
}

export const GenresSection = ({
  musicGenres,
  isLoadingGenres,
}: GenresSectionProps) => {
  const {
    formState: { errors },
  } = useFormContext<FormValues>();

  const {
    formGenres,
    isAddingGenre,
    genreInputRef,
    addGenreButtonRef,
    accessibilityGenreFocusRef,
    handleAddGenre,
    handleGenreSelect,
    handleRemoveGenre,
  } = useGenres();

  return (
    <div className="space-y-3">
      <div>
        <h4 className="font-semibold text-xl mb-1.5">Genres musicaux</h4>
        <p className="text-sm text-muted-foreground">
          Ajoutez vos genres musicaux préférés
        </p>
      </div>
      <div>
        {/* Genres sélectionnés */}
        {formGenres.map((genre: string, index: number) => (
          <GenreItem
            key={`${genre}-${index}`}
            genre={genre}
            index={index}
            onRemove={handleRemoveGenre}
            isLast={index === formGenres.length - 1}
          />
        ))}

        {/* Interface d'ajout de genre */}
        {isAddingGenre ? (
          <div>
            <GenreAutocomplete
              ref={genreInputRef}
              value=""
              onValueChange={handleGenreSelect}
              genres={musicGenres || []}
              isLoading={isLoadingGenres}
              placeholder="Rechercher un genre..."
              excludedGenres={formGenres}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <div
              ref={accessibilityGenreFocusRef}
              tabIndex={-1}
              aria-hidden="true"
              className="sr-only"
            />

            {formGenres.length >= 10 && (
              <p className="text-sm text-amber-600 rounded-md flex items-center gap-1.5">
                <Info className="!size-4" />
                Vous avez atteint le maximum de 10 genres.
              </p>
            )}

            <Button
              ref={addGenreButtonRef}
              type="button"
              variant="outline"
              onClick={handleAddGenre}
              disabled={isLoadingGenres || formGenres.length >= 10}
              className="rounded-md"
            >
              <Plus className="!size-5" />
              Ajouter un genre
            </Button>
          </div>
        )}

        {/* Erreurs genres */}
        {(errors.genres?.root?.message || errors.genres?.message) && (
          <p className="text-red-500 text-sm mt-1">
            {errors.genres?.root?.message || errors.genres?.message}
          </p>
        )}
      </div>
    </div>
  );
};
