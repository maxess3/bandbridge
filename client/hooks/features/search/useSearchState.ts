import { useState, useCallback } from "react";
import { AutocompleteSearchResult } from "@/types/Search";

export interface UseSearchStateProps {
  minSearchLength: number;
}

export const useSearchState = ({ minSearchLength }: UseSearchStateProps) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [displayedProfiles, setDisplayedProfiles] = useState<
    AutocompleteSearchResult[]
  >([]);

  const trimmedSearch = search.trim();
  const shouldShowAutocomplete =
    trimmedSearch.length >= minSearchLength && isFocused;

  const resetSelection = useCallback(() => {
    setSelectedIndex(-1);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSelectedIndex(-1);
  }, []);

  const openDropdown = useCallback(() => {
    if (shouldShowAutocomplete) {
      setIsOpen(true);
      setSelectedIndex(-1);
    }
  }, [shouldShowAutocomplete]);

  const updateProfiles = useCallback((profiles: AutocompleteSearchResult[]) => {
    setDisplayedProfiles(profiles);
    setIsOpen(true);
    setSelectedIndex(-1);
  }, []);

  const navigateDown = useCallback((totalItems: number) => {
    setSelectedIndex((prev) => {
      if (prev === -1) return 0;
      return prev < totalItems - 1 ? prev + 1 : 0;
    });
  }, []);

  const navigateUp = useCallback((totalItems: number) => {
    setSelectedIndex((prev) => {
      if (prev === -1) return totalItems - 1;
      return prev > 0 ? prev - 1 : totalItems - 1;
    });
  }, []);

  const selectProfile = useCallback(() => {
    setIsOpen(false);
    setSelectedIndex(-1);
  }, []);

  return {
    // États
    search,
    isOpen,
    isFocused,
    selectedIndex,
    displayedProfiles,
    trimmedSearch,
    shouldShowAutocomplete,

    // Actions
    setSearch,
    setIsFocused,
    resetSelection,
    closeDropdown,
    openDropdown,
    updateProfiles,
    navigateDown,
    navigateUp,
    selectProfile,
  };
};
