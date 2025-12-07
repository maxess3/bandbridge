"use client";

import { useQuery } from "@tanstack/react-query";

export const MUSIC_GENRES_QUERY_KEY = ["musicGenres"];

export function useMusicGenres() {
  return useQuery<string[]>({
    queryKey: MUSIC_GENRES_QUERY_KEY,
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/genres`
      );
      if (!response.ok) {
        throw new Error("Impossible de récupérer les genres musicaux");
      }
      return response.json();
    },
  });
}
