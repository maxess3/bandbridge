"use client";

import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useDelayedQuery } from "@/hooks/useDelayedQuery";

export const PROFILE_QUERY_KEY = ["profile"];

export function useProfile() {
  const axiosAuth = useAxiosAuth();

  return useDelayedQuery(
    PROFILE_QUERY_KEY,
    async () => {
      const { data } = await axiosAuth.get("/profile/me");
      return data;
    },
    {
      queryKey: PROFILE_QUERY_KEY,
      refetchOnMount: true,
      staleTime: Infinity,
      delay: 400,
    }
  );
}
