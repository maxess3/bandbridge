"use client";

import { AutocompleteResponse } from "@/types/Profile";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";

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
    staleTime: 5 * 60 * 1000, // 5 Minutes
  });
}
