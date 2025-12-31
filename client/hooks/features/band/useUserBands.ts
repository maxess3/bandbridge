"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { Band } from "@/types/Band";

export const USER_BANDS_QUERY_KEY = ["userBands"];

export function useUserBands() {
  const axiosAuth = useAxiosAuth();

  return useQuery<Band[]>({
    queryKey: USER_BANDS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await axiosAuth.get<Band[]>("/band/user-bands");
      return data;
    },
  });
}
