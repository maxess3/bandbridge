"use client";

import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useDelayedQuery } from "@/hooks/data/useDelayedQuery";

export const SETTINGS_QUERY_KEY = ["settings"];

export function useSettings() {
  const axiosAuth = useAxiosAuth();

  return useDelayedQuery(
    SETTINGS_QUERY_KEY,
    async () => {
      const { data } = await axiosAuth.get("/settings/user-settings");
      return data;
    },
    {
      queryKey: [...SETTINGS_QUERY_KEY, "user"],
      staleTime: Infinity,
      delay: 800,
    }
  );
}
