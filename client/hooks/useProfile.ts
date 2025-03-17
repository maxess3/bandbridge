"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";

export const PROFILE_QUERY_KEY = ["profile"];

export function useProfile() {
  const axiosAuth = useAxiosAuth();

  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const { data } = await axiosAuth.get("/profile");
      console.log(data);
      return data;
    },
    refetchOnMount: true,
    staleTime: Infinity,
  });
}
