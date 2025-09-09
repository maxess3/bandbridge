import { useState, useCallback } from "react";
import { AutocompleteSearchResult } from "@/types/Search";

export const useSearchCache = () => {
  const [cache, setCache] = useState<
    Record<string, AutocompleteSearchResult[]>
  >({});

  const addToCache = useCallback(
    (query: string, profiles: AutocompleteSearchResult[]) => {
      setCache((prev) => ({ ...prev, [query]: profiles }));
    },
    []
  );

  const getFromCache = useCallback((query: string) => cache[query], [cache]);

  return { addToCache, getFromCache };
};
