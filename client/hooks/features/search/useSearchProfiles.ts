"use client";

import { useDelayedQuery } from "@/hooks/data/useDelayedQuery";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { SearchResponse } from "@/types/Search";

export const SEARCH_PROFILES_QUERY_KEY = ["search", "profiles"];

export function useSearchProfiles(
  query: string,
  page: number = 1
) {
  const axiosAuth = useAxiosAuth();

  // Valider que la page ne dépasse pas 100
  const validatedPage = Math.min(Math.max(1, page), 100);

  return useDelayedQuery(
    SEARCH_PROFILES_QUERY_KEY,
    async (): Promise<SearchResponse> => {
      const endpoint = `/profile/search?q=${encodeURIComponent(
        query
      )}&page=${validatedPage}`;
      const { data } = await axiosAuth.get(endpoint);
      return data;
    },
    {
      queryKey: [...SEARCH_PROFILES_QUERY_KEY, query, validatedPage],
      enabled: query.trim().length >= 1,
      staleTime: 5 * 60 * 1000, // 5 min
      delay: 400,
    }
  );
}
