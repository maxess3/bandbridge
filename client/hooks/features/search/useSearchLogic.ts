import { useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchAutocomplete } from "./useSearchAutocomplete";
import { useSearchCache } from "@/hooks/data/useSearchCache";
import { AutocompleteSearchResult } from "@/types/Search";
import { SEARCH_CONSTANTS } from "@/types/Search";

const { MIN_SEARCH_LENGTH, DEBOUNCE_DELAY } = SEARCH_CONSTANTS;

export interface UseSearchLogicProps {
  search: string;
  shouldShowAutocomplete: boolean;
  onUpdateProfiles: (profiles: AutocompleteSearchResult[]) => void;
  onOpenDropdown: () => void;
}

export const useSearchLogic = ({
  search,
  shouldShowAutocomplete,
  onUpdateProfiles,
  onOpenDropdown,
}: UseSearchLogicProps) => {
  const { addToCache, getFromCache } = useSearchCache();
  const trimmedSearch = search.trim();
  const debouncedSearch = useDebounce(trimmedSearch, DEBOUNCE_DELAY);
  const shouldSearch = debouncedSearch.length >= MIN_SEARCH_LENGTH;

  const { data, isSuccess, isLoading } = useSearchAutocomplete(
    shouldSearch ? debouncedSearch : ""
  );

  // Gérer le cache et l'affichage des profils
  useEffect(() => {
    if (!shouldShowAutocomplete) {
      return;
    }

    // Priorité au cache local pour un affichage immédiat
    const cachedProfiles = getFromCache(trimmedSearch);
    if (cachedProfiles) {
      onUpdateProfiles(cachedProfiles);
      onOpenDropdown();
      return;
    }

    // Utiliser les données de la requête si disponibles
    if (data?.profiles && debouncedSearch === trimmedSearch) {
      onUpdateProfiles(data.profiles);
      onOpenDropdown();
      addToCache(debouncedSearch, data.profiles);
      return;
    }

    // Attendre la fin du chargement
    if (isSuccess && !isLoading && debouncedSearch === trimmedSearch) {
      onOpenDropdown();
    }
  }, [
    shouldShowAutocomplete,
    trimmedSearch,
    debouncedSearch,
    isSuccess,
    isLoading,
    addToCache,
    data?.profiles,
    getFromCache,
    onUpdateProfiles,
    onOpenDropdown,
  ]);

  return {
    isLoading,
    debouncedSearch,
  };
};
