"use client";

import { useDelayedQuery } from "@/hooks/data/useDelayedQuery";
import axios from "@/lib/axios";
import { SearchResponse } from "@/types/Search";

export const ALL_MUSICIANS_QUERY_KEY = ["musicians", "all"];

export function useAllMusicians(page: number = 1) {
  // Valider que la page ne dépasse pas 100
  const validatedPage = Math.min(Math.max(1, page), 100);

  return useDelayedQuery(
    ALL_MUSICIANS_QUERY_KEY,
    async (): Promise<SearchResponse> => {
      const endpoint = `/profile/all?page=${validatedPage}`;
      const { data } = await axios.get(endpoint);
      return data;
    },
    {
      queryKey: [...ALL_MUSICIANS_QUERY_KEY, validatedPage],
      staleTime: 5 * 60 * 1000, // 5 min
      delay: 400,
    },
  );
}
