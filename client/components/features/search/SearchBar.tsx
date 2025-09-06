import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import AutocompleteDropdown from "@/components/features/search/AutocompleteDropdown";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchAutocomplete } from "@/hooks/useSearchAutocomplete";
import { IoIosSearch } from "react-icons/io";
import { SEARCH_CONSTANTS, AutocompleteSearchResult } from "@/types/Search";

const { MIN_SEARCH_LENGTH, DEBOUNCE_DELAY } = SEARCH_CONSTANTS;

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search, DEBOUNCE_DELAY);
  const shouldSearch = debouncedSearch.length >= MIN_SEARCH_LENGTH;

  const { data, isLoading: isQueryLoading } = useSearchAutocomplete(
    shouldSearch ? debouncedSearch : ""
  );

  const profiles = data?.profiles || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.length > 0) {
      setIsOpen(true);
      console.log("open");
    } else {
      setIsOpen(false);
      console.log("close");
    }
  };

  const handleProfileSelect = (profile: AutocompleteSearchResult) => {
    setIsOpen(false);
    setSearch("");
    router.push(`/${profile.user.username}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="max-w-[700px] w-full relative">
      <Input
        ref={inputRef}
        type="text"
        placeholder="Rechercher un musicien..."
        className="h-full pl-11 pr-6 rounded-full z-50"
        value={search}
        onChange={handleChange}
      />
      <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-6 opacity-60" />

      {isOpen && (
        <AutocompleteDropdown
          ref={dropdownRef}
          profiles={profiles}
          onProfileSelect={handleProfileSelect}
        />
      )}
    </div>
  );
}
