import { useCallback } from "react";
import { AutocompleteSearchResult } from "@/types/Search";

export interface UseSearchKeyboardProps {
  isOpen: boolean;
  selectedIndex: number;
  displayedProfiles: AutocompleteSearchResult[];
  isFocused: boolean;
  shouldShowAutocomplete: boolean;
  onNavigateDown: () => void;
  onNavigateUp: () => void;
  onSelectProfile: (profile: AutocompleteSearchResult) => void;
  onCloseDropdown: () => void;
  onForceOpen: () => void;
  onSearchSubmit?: (searchTerm: string) => void;
  onViewAllResults?: () => void;
}

export const useSearchKeyboard = ({
  isOpen,
  selectedIndex,
  displayedProfiles,
  isFocused,
  shouldShowAutocomplete,
  onNavigateDown,
  onNavigateUp,
  onSelectProfile,
  onCloseDropdown,
  onForceOpen,
  onSearchSubmit,
  onViewAllResults,
}: UseSearchKeyboardProps) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<Element>) => {
      // Si le dropdown est fermé et qu'on appuie sur la flèche du bas
      if (
        !isOpen &&
        e.key === "ArrowDown" &&
        isFocused &&
        shouldShowAutocomplete
      ) {
        e.preventDefault();
        e.stopPropagation();
        onForceOpen();
        onNavigateDown();
        return;
      }

      // Gestion de la touche Entrée quand le dropdown est fermé
      if (!isOpen && e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        const searchTerm = (e.target as HTMLInputElement).value.trim();
        if (searchTerm && onSearchSubmit) {
          onSearchSubmit(searchTerm);
        }
        return;
      }

      // Si le dropdown n'est pas ouvert, on ne gère que Escape
      if (!isOpen) {
        if (e.key === "Escape") {
          onCloseDropdown();
        }
        return;
      }

      // Le dropdown est ouvert, on gère la navigation
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          e.stopPropagation();
          onNavigateDown();
          break;
        case "ArrowUp":
          e.preventDefault();
          e.stopPropagation();
          onNavigateUp();
          break;
        case "Enter":
          e.preventDefault();
          e.stopPropagation();
          if (selectedIndex >= 0 && selectedIndex < displayedProfiles.length) {
            // Sélection d'un profil
            const profile = displayedProfiles[selectedIndex];
            onSelectProfile(profile);
          } else if (selectedIndex === displayedProfiles.length) {
            // Sélection du bouton "Voir tous les résultats"
            if (onViewAllResults) {
              onViewAllResults();
            }
          } else {
            // Si aucun profil n'est sélectionné, soumettre la recherche
            const searchTerm = (e.target as HTMLInputElement).value.trim();
            if (searchTerm && onSearchSubmit) {
              onSearchSubmit(searchTerm);
            }
          }
          break;
        case "Escape":
          e.preventDefault();
          e.stopPropagation();
          onCloseDropdown();
          break;
        case "Tab":
          onCloseDropdown();
          break;
      }
    },
    [
      isOpen,
      selectedIndex,
      displayedProfiles,
      isFocused,
      shouldShowAutocomplete,
      onNavigateDown,
      onNavigateUp,
      onSelectProfile,
      onCloseDropdown,
      onForceOpen,
      onSearchSubmit,
      onViewAllResults,
    ]
  );

  return { handleKeyDown };
};
