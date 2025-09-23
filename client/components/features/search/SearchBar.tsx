import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import SearchAutocomplete from "@/components/features/search/SearchAutocomplete";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchAutocomplete } from "@/hooks/useSearchAutocomplete";
import { useSearchCache } from "@/hooks/useSearchCache";
import { useClickOutside } from "@/hooks/useClickOutside";
import { IoIosSearch } from "react-icons/io";
import { SEARCH_CONSTANTS, AutocompleteSearchResult } from "@/types/Search";

const { MIN_SEARCH_LENGTH, DEBOUNCE_DELAY } = SEARCH_CONSTANTS;

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [displayedProfiles, setDisplayedProfiles] = useState<
    AutocompleteSearchResult[]
  >([]);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { addToCache, getFromCache } = useSearchCache();

  const trimmedSearch = search.trim();
  const debouncedSearch = useDebounce(trimmedSearch, DEBOUNCE_DELAY);

  const shouldSearch = debouncedSearch.length >= MIN_SEARCH_LENGTH;
  const shouldShowAutocomplete =
    trimmedSearch.length >= MIN_SEARCH_LENGTH && isFocused;

  const { data, isSuccess, isLoading } = useSearchAutocomplete(
    shouldSearch ? debouncedSearch : ""
  );

  useClickOutside({
    ref: dropdownRef,
    onOutsideClick: () => {
      setIsOpen(false);
      setSelectedIndex(-1);
    },
    enabled: isOpen,
  });

  // Gérer le cache et l'affichage des profils
  useEffect(() => {
    if (!shouldShowAutocomplete) {
      setIsOpen(false);
      setSelectedIndex(-1);
      console.log("shouldShowAutocomplete false");
      return;
    }

    // Priorité au cache local pour un affichage immédiat
    const cachedProfiles = getFromCache(trimmedSearch);
    if (cachedProfiles) {
      setDisplayedProfiles(cachedProfiles);
      setIsOpen(true);
      setSelectedIndex(-1);
      return;
    }

    // Utiliser les données de la requête si disponibles
    if (data?.profiles && debouncedSearch === trimmedSearch) {
      setDisplayedProfiles(data.profiles);
      setIsOpen(true);
      setSelectedIndex(-1);
      addToCache(debouncedSearch, data.profiles);
      return;
    }

    // Attendre la fin du chargement
    if (isSuccess && !isLoading && debouncedSearch === trimmedSearch) {
      setIsOpen(true);
      setSelectedIndex(-1);
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
  ]);

  // Réinitialiser l'index sélectionné quand la liste change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [displayedProfiles]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.length < MIN_SEARCH_LENGTH) {
      setIsOpen(false);
      setSelectedIndex(-1);
      console.log("value.length < MIN_SEARCH_LENGTH");
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<Element>) => {
    // Si le dropdown est fermé et qu'on appuie sur la flèche du bas
    if (
      !isOpen &&
      e.key === "ArrowDown" &&
      isFocused &&
      shouldShowAutocomplete
    ) {
      e.preventDefault();
      e.stopPropagation();

      // Forcer la réouverture - le useEffect se chargera du reste
      setIsOpen(true);
      setSelectedIndex(0);
      return;
    }

    if (!isOpen || displayedProfiles.length === 0) {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
      return;
    }

    // Total d'éléments = profils + bouton "Voir tous les résultats"
    const totalItems = displayedProfiles.length + 1;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((prev) => {
          if (prev === -1) return 0;
          return prev < totalItems - 1 ? prev + 1 : 0;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((prev) => {
          if (prev === -1) return totalItems - 1;
          return prev > 0 ? prev - 1 : totalItems - 1;
        });
        break;
      case "Enter":
        e.preventDefault();
        e.stopPropagation();
        if (selectedIndex >= 0 && selectedIndex < displayedProfiles.length) {
          // Sélection d'un profil
          const profile = displayedProfiles[selectedIndex];
          handleProfileSelect(profile);
        } else if (selectedIndex === displayedProfiles.length) {
          // Sélection du bouton "Voir tous les résultats"
          console.log("Voir tous les résultats");
          // Ici vous pouvez ajouter la logique pour naviguer vers la page de résultats
        }
        break;
      case "Escape":
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      case "Tab":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleProfileSelect = (profile: AutocompleteSearchResult) => {
    setIsOpen(false);
    setSelectedIndex(-1);
    setSearch("");
    inputRef.current?.blur();
    router.push(`/${profile.user.username}`);
  };

  return (
    <div className="max-w-[700px] w-full relative">
      <Input
        ref={inputRef}
        type="text"
        placeholder="Rechercher un musicien..."
        className="h-full pl-11 pr-6 rounded-full relative"
        value={search}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-6 opacity-60" />
      {isOpen && (
        <SearchAutocomplete
          ref={dropdownRef}
          profiles={displayedProfiles}
          onProfileSelect={handleProfileSelect}
          selectedIndex={selectedIndex}
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
}
