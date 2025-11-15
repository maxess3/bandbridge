import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import SearchAutocomplete from "./SearchAutocomplete";
import { IoIosSearch } from "react-icons/io";
import { SEARCH_CONSTANTS, AutocompleteSearchResult } from "@/types/Search";
import {
  useSearchState,
  useSearchKeyboard,
  useSearchFocus,
  useSearchScroll,
  useSearchLogic,
} from "@/hooks/features/search";

const { MIN_SEARCH_LENGTH } = SEARCH_CONSTANTS;

export const SearchBar = () => {
  const router = useRouter();

  // Hooks pour la gestion des états
  const searchState = useSearchState({ minSearchLength: MIN_SEARCH_LENGTH });
  const {
    search,
    isOpen,
    isFocused,
    selectedIndex,
    displayedProfiles,
    shouldShowAutocomplete,
    setSearch,
    setIsFocused,
    closeDropdown,
    openDropdown,
    updateProfiles,
    navigateDown,
    navigateUp,
    selectProfile,
  } = searchState;

  // Hooks pour la logique métier
  useSearchLogic({
    search,
    shouldShowAutocomplete,
    onUpdateProfiles: updateProfiles,
    onOpenDropdown: openDropdown,
  });

  // Hooks pour la gestion du focus et des refs
  const { inputRef, dropdownRef, blurInput } = useSearchFocus({
    isOpen,
    onCloseDropdown: closeDropdown,
  });

  // Hook pour le scroll automatique
  useSearchScroll({
    selectedIndex,
    dropdownRef,
  });

  const handleProfileSelect = (profile: AutocompleteSearchResult) => {
    selectProfile();
    setSearch("");
    blurInput();
    router.push(`/${profile.user.username}`);
  };

  const handleSearchSubmit = (searchTerm: string) => {
    closeDropdown();
    blurInput();
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleViewAllResults = () => {
    closeDropdown();
    blurInput();
    router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  // Hook pour la navigation clavier
  const { handleKeyDown } = useSearchKeyboard({
    isOpen,
    selectedIndex,
    displayedProfiles,
    isFocused,
    shouldShowAutocomplete,
    onNavigateDown: () => navigateDown(displayedProfiles.length + 1),
    onNavigateUp: () => navigateUp(displayedProfiles.length + 1),
    onSelectProfile: handleProfileSelect,
    onCloseDropdown: closeDropdown,
    onForceOpen: openDropdown,
    onSearchSubmit: handleSearchSubmit,
    onViewAllResults: handleViewAllResults,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.length < MIN_SEARCH_LENGTH) {
      closeDropdown();
    }
  };

  const handleFocusEvent = () => {
    setIsFocused(true);
  };

  const handleBlurEvent = () => {
    setIsFocused(false);
  };

  return (
    <div className="max-w-xl w-full relative">
      <Input
        ref={inputRef}
        type="text"
        placeholder="Rechercher sur chordeus..."
        className="h-10 pl-10 pr-6 rounded-md relative"
        value={search}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocusEvent}
        onBlur={handleBlurEvent}
      />
      <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-5 opacity-60" />
      {isOpen && (
        <SearchAutocomplete
          ref={dropdownRef}
          profiles={displayedProfiles}
          onProfileSelect={handleProfileSelect}
          onViewAllResults={handleViewAllResults}
          selectedIndex={selectedIndex}
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
};
