import { notFound } from "next/navigation";
import { Profile } from "@/types/Profile";

export const profileServices = {
  getProfile: async (username: string): Promise<Profile> => {
    const res = await fetch(`${process.env.API_URL}/profile/${username}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        notFound();
      }
      throw new Error("Le profil ne peut pas être récupéré");
    }
    const data = await res.json();
    // console.log(data);
    return data;
  },
};
