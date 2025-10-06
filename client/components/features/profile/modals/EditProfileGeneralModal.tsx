"use client";

import { EditModal } from "@/components/shared/modals/EditModal";
import { UpdateProfileGeneralForm } from "@/components/features/profile/forms";
import { formGeneralProfile } from "@/lib/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useProfile } from "@/hooks/features/profile";
import { PROFILE_QUERY_KEY } from "@/hooks/features/profile/useProfile";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useTransitionDelay } from "@/hooks/ui";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { AutocompleteProvider } from "@/contexts/AutocompleteContext";
import { useSession } from "next-auth/react";
import { useSessionUpdate } from "@/hooks/useSessionUpdate";
import { GroupedInstruments } from "@/types/Instrument";

export function EditProfileGeneralModal() {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const { data: session } = useSession();
  const { updateSession } = useSessionUpdate();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: loadingProfile } = useProfile();
  const { isDelaying, withDelay } = useTransitionDelay(600);

  // Précharger les données des instruments et genres
  const { data: instrumentTypes, isLoading: isLoadingInstruments } =
    useQuery<GroupedInstruments>({
      queryKey: ["instrumentTypes"],
      queryFn: async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/profile/instruments`
        );
        if (!response.ok) {
          throw new Error("Impossible de récupérer les instruments");
        }
        return response.json();
      },
    });

  const { data: musicGenres, isLoading: isLoadingGenres } = useQuery<string[]>({
    queryKey: ["musicGenres"],
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

  // Attendre que toutes les données soient chargées avant d'ouvrir la modale
  const isLoadingAllData =
    loadingProfile || isLoadingInstruments || isLoadingGenres;

  const updateProfileMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formGeneralProfile>) => {
      const { data } = await axiosAuth.put("/profile/me", values);
      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });

      const pseudonymeChanged =
        data?.user?.pseudonyme &&
        session?.user?.pseudonyme !== data?.user?.pseudonyme;

      // Mettre à jour la session si nécessaire
      if (pseudonymeChanged) {
        await updateSession({
          pseudonyme: data?.user?.pseudonyme,
        });
      }

      // Rediriger vers la page de profil après la mise à jour
      if (window.history.length > 2) {
        router.back();
      } else {
        router.push(`/${profile?.username}`);
      }
    },
  });

  return (
    <AutocompleteProvider>
      {profile && (
        <EditModal<z.infer<typeof formGeneralProfile>>
          open={!isLoadingAllData}
          onSubmit={async (values) => {
            return withDelay(() => updateProfileMutation.mutateAsync(values));
          }}
          formSchema={formGeneralProfile}
          navigationRoute={`/${profile?.username}`}
          defaultValues={{
            pseudonyme: profile?.pseudonyme || "",
            country: (profile?.country || "France") as "France",
            zipcode: profile?.zipCode ?? "",
            city: profile?.city ?? "",
            instruments:
              profile?.instruments?.map(
                (
                  instrument: {
                    instrumentTypeId: string;
                    level: string | null;
                    order?: number;
                  },
                  index: number
                ) => ({
                  instrumentTypeId: instrument.instrumentTypeId || "",
                  level: instrument.level as
                    | "BEGINNER"
                    | "INTERMEDIATE"
                    | "ADVANCED"
                    | "EXPERT"
                    | null,
                  order: instrument.order ?? index,
                })
              ) || [],
            genres: profile?.genres || [],
          }}
          title="Modifier le résumé"
          isSubmitting={updateProfileMutation.isPending || isDelaying}
        >
          <UpdateProfileGeneralForm
            instrumentTypes={instrumentTypes || {}}
            musicGenres={musicGenres || []}
            isLoadingInstruments={isLoadingInstruments}
            isLoadingGenres={isLoadingGenres}
          />
        </EditModal>
      )}
    </AutocompleteProvider>
  );
}
