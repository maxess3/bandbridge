"use client";

import type {
  BandMemberListItem,
  BandMembersResponse,
} from "@/types/Band";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useDelayedQuery } from "@/hooks/data/useDelayedQuery";
import { BAND_QUERY_KEY } from "./useBand";

export function useBandMembers(slug: string) {
  const axiosAuth = useAxiosAuth();

  return useDelayedQuery(
    BAND_QUERY_KEY,
    async (): Promise<BandMemberListItem[]> => {
      const { data } = await axiosAuth.get<BandMembersResponse>(
        `/band/${slug}/members`,
      );
      return data.members;
    },
    {
      queryKey: [...BAND_QUERY_KEY, slug, "members"],
      staleTime: Infinity,
      delay: 400,
    },
  );
}
