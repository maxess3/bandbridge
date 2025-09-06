"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { AutocompleteResponse } from "@/types/Search";

export const SEARCH_AUTOCOMPLETE_QUERY_KEY = ["search", "autocomplete"];

export function useSearchAutocomplete(query: string) {
  const axiosAuth = useAxiosAuth();

  return useQuery({
    queryKey: [...SEARCH_AUTOCOMPLETE_QUERY_KEY, query],
    queryFn: async (): Promise<AutocompleteResponse> => {
      const endpoint = `/profile/autocomplete?q=${encodeURIComponent(query)}`;
      const { data } = await axiosAuth.get(endpoint);
      return data;
    },
    enabled: query.length >= 1,
    staleTime: 5 * 60 * 1000, // 5 Minutes
  });
}
