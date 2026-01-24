"use client";

import { useDelayedQuery } from "@/hooks/data/useDelayedQuery";
import axios from "@/lib/axios";
import { BandListItem } from "@/types/Band";

export const ALL_BANDS_QUERY_KEY = ["bands", "all"];

export interface BandsResponse {
  bands: BandListItem[];
  page: number;
  totalPages: number;
  totalFound: number;
}

export function useAllBands(page: number = 1) {
  // Valider que la page ne dépasse pas 100
  const validatedPage = Math.min(Math.max(1, page), 100);

  return useDelayedQuery(
    ALL_BANDS_QUERY_KEY,
    async (): Promise<BandsResponse> => {
      const endpoint = `/band/all?page=${validatedPage}`;
      const { data } = await axios.get(endpoint);
      return data;
    },
    {
      queryKey: [...ALL_BANDS_QUERY_KEY, validatedPage],
      staleTime: 5 * 60 * 1000, // 5 min
      delay: 400,
    }
  );
}
