"use client";

import { BandPageData } from "@/types/Band";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useDelayedQuery } from "@/hooks/data/useDelayedQuery";

export const BAND_QUERY_KEY = ["band"];

export function useBand(slug: string) {
  const axiosAuth = useAxiosAuth();

  return useDelayedQuery(
    BAND_QUERY_KEY,
    async (): Promise<BandPageData> => {
      const { data } = await axiosAuth.get<BandPageData>(`/band/${slug}`);
      return data;
    },
    {
      queryKey: [...BAND_QUERY_KEY, slug],
      staleTime: Infinity,
      delay: 0,
    },
  );
}
