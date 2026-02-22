import { BandPageData } from "@/types/Band";

export const bandServices = {
  getBandBySlug: async (
    slug: string,
    accessToken?: string | null,
  ): Promise<BandPageData | null> => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (accessToken) {
      (headers as Record<string, string>)["Authorization"] =
        `Bearer ${accessToken}`;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/band/${slug}`,
      { headers },
    );

    if (res.status === 404) {
      return null;
    }
    if (!res.ok) {
      throw new Error("Le groupe ne peut pas être récupéré");
    }
    return res.json();
  },
};
