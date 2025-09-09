import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import AutocompleteDropdown from "@/components/features/search/AutocompleteDropdown";
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
    },
    enabled: isOpen,
  });

  // Gérer le cache et l'affichage des profils
  useEffect(() => {
    if (!shouldShowAutocomplete) {
      setIsOpen(false);
      console.log("shouldShowAutocomplete false");
      return;
    }

    // Priorité au cache local pour un affichage immédiat
    const cachedProfiles = getFromCache(trimmedSearch);
    if (cachedProfiles) {
      setDisplayedProfiles(cachedProfiles);
      setIsOpen(true);
      return;
    }

    // Utiliser les données de la requête si disponibles
    if (data?.profiles && debouncedSearch === trimmedSearch) {
      setDisplayedProfiles(data.profiles);
      setIsOpen(true);
      addToCache(debouncedSearch, data.profiles);
      return;
    }

    // Attendre la fin du chargement
    if (isSuccess && !isLoading && debouncedSearch === trimmedSearch) {
      setIsOpen(true);
    }
  }, [
    shouldShowAutocomplete,
    trimmedSearch,
    debouncedSearch,
    isSuccess,
    isLoading,
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.length < MIN_SEARCH_LENGTH) {
      setIsOpen(false);
      console.log("value.length < MIN_SEARCH_LENGTH");
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" || e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleProfileSelect = (profile: AutocompleteSearchResult) => {
    setIsOpen(false);
    setSearch("");
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
        <AutocompleteDropdown
          ref={dropdownRef}
          profiles={displayedProfiles}
          onProfileSelect={handleProfileSelect}
        />
      )}
    </div>
  );
}
