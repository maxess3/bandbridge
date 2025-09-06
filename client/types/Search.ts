import { Instrument } from "@/types/Instrument";

export const SEARCH_CONSTANTS = {
  MIN_SEARCH_LENGTH: 1,
  DEBOUNCE_DELAY: 300,
} as const;

export interface AutocompleteSearchResult {
  id: string;
  pseudonyme: string;
  profilePictureKey: string | null;
  lastActiveAt: Date | null;
  city: string | null;
  departmentName: string | null;
  user: {
    username: string;
  };
  instruments: Instrument[];
  _count: {
    followers: number;
  };
}

export interface AutocompleteResponse {
  profiles: AutocompleteSearchResult[];
  hasMore: boolean;
  totalFound: number;
}

export interface AutocompleteDropdownProps {
  profiles: AutocompleteSearchResult[];
  onProfileSelect: (profile: AutocompleteSearchResult) => void;
  isLoading?: boolean;
  showViewAll?: boolean;
}

export interface SearchResponse {
  profiles: AutocompleteSearchResult[];
  nextCursor: string | null;
  hasMore: boolean;
  totalFound: number;
}
