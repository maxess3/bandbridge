"use client";

import React, { useMemo } from "react";
import { BaseAutocomplete } from "@/components/shared/autocomplete/BaseAutocomplete";
import { BaseAutocompleteItem } from "@/components/shared/autocomplete/types/autocomplete";
import { translateGenre } from "@/utils/translations/genreTranslations";

interface GenreItem extends BaseAutocompleteItem {
  name: string;
  translatedName: string;
}

interface GenreAutocompleteProps {
  value?: string;
  onValueChange: (value: string) => void;
  genres: string[];
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  error?: boolean;
  onDropdownStateChange?: (isOpen: boolean) => void;
  excludedGenres?: string[];
}

export const GenreAutocomplete = React.forwardRef<
  HTMLInputElement,
  GenreAutocompleteProps
>(
  (
    {
      value = "",
      onValueChange,
      genres,
      isLoading = false,
      placeholder = "Tapez pour rechercher un genre...",
      className,
      error = false,
      excludedGenres = [],
      onDropdownStateChange,
    },
    ref
  ) => {
    // Convertir les genres en format BaseAutocompleteItem
    const genreItems: GenreItem[] = useMemo(() => {
      return genres.map((genre) => ({
        id: genre,
        name: genre,
        translatedName: translateGenre(genre),
      }));
    }, [genres]);

    // Fonction de filtrage des genres
    const filterGenres = (items: GenreItem[], searchValue: string) => {
      if (!searchValue) {
        return items.filter((item) => !excludedGenres.includes(item.name));
      }

      const searchValueLower = searchValue.toLowerCase();
      return items.filter((item) => {
        if (excludedGenres.includes(item.name)) {
          return false;
        }

        return (
          item.name.toLowerCase().includes(searchValueLower) ||
          item.translatedName.toLowerCase().includes(searchValueLower)
        );
      });
    };

    // Fonction pour obtenir la valeur d'affichage
    const getGenreDisplayValue = (item: GenreItem) => {
      return item.translatedName;
    };

    // Fonction de rendu des éléments
    const renderGenreItem = (item: GenreItem) => {
      return item.translatedName;
    };

    // Gérer la sélection d'un genre
    const handleGenreSelect = (item: GenreItem) => {
      onValueChange(item.name);
    };

    // Obtenir la valeur d'affichage pour l'input
    const getDisplayValue = () => {
      if (!value) return "";
      return translateGenre(value);
    };

    return (
      <BaseAutocomplete
        ref={ref}
        items={genreItems}
        value={getDisplayValue()}
        onValueChange={(displayValue) => {
          // Si l'utilisateur tape quelque chose qui correspond exactement à un genre traduit
          const exactMatch = genreItems.find(
            (item) => item.translatedName === displayValue
          );
          if (exactMatch) {
            onValueChange(exactMatch.name);
            return;
          }

          // Sinon, permettre à l'utilisateur de taper librement
          // On ne fait rien ici, la valeur reste dans l'input pour la recherche
        }}
        onItemSelect={handleGenreSelect}
        renderItem={renderGenreItem}
        filterItems={filterGenres}
        getItemDisplayValue={getGenreDisplayValue}
        placeholder={placeholder}
        isLoading={isLoading}
        error={error}
        className={className}
        minSearchLength={1}
        onDropdownStateChange={onDropdownStateChange}
      />
    );
  }
);

GenreAutocomplete.displayName = "GenreAutocomplete";
