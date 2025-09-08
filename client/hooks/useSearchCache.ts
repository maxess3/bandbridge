import { useState } from "react";
import { AutocompleteSearchResult } from "@/types/Search";

export const useSearchCache = () => {
  const [cache, setCache] = useState<
    Record<string, AutocompleteSearchResult[]>
  >({});

  const addToCache = (query: string, profiles: AutocompleteSearchResult[]) => {
    setCache((prev) => ({ ...prev, [query]: profiles }));
  };

  const getFromCache = (query: string) => cache[query];

  return { addToCache, getFromCache };
};
