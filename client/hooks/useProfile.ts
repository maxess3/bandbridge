"use client";

import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useDelayedQuery } from "@/hooks/useDelayedQuery";

export const PROFILE_QUERY_KEY = ["profile"];

export function useProfile(username?: string) {
  const axiosAuth = useAxiosAuth();

  return useDelayedQuery(
    PROFILE_QUERY_KEY,
    async () => {
      const endpoint = username ? `/profile/${username}` : "/profile/me";
      const { data } = await axiosAuth.get(endpoint);
      return data;
    },
    {
      queryKey: [...PROFILE_QUERY_KEY, username ?? "me"],
      staleTime: Infinity,
      delay: 0,
    }
  );
}
