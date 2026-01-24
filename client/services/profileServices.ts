import { Profile } from "@/types/Profile";

export const profileServices = {
  getProfile: async (username: string): Promise<Profile | null> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profile/${username}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error("Le profil ne peut pas être récupéré");
    }
    const data = await res.json();
    return data;
  },
};
