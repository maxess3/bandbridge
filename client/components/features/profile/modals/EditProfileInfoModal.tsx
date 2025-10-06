"use client";

import { EditModal } from "@/components/shared/modals/EditModal";
import { UpdateProfileInfoForm } from "@/components/features/profile/forms";
import { formInfoProfile } from "@/lib/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/hooks/features/profile";
import { PROFILE_QUERY_KEY } from "@/hooks/features/profile/useProfile";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useTransitionDelay } from "@/hooks/ui";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { AutocompleteProvider } from "@/contexts/AutocompleteContext";

export function EditProfileInfoModal() {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: loadingProfile } = useProfile();
  const { isDelaying, withDelay } = useTransitionDelay(600);

  const updateProfileMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formInfoProfile>) => {
      const { data } = await axiosAuth.put("/profile/me/info", values);
      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });

      if (window.history.length > 2) {
        router.back();
      } else {
        router.push(`/${data?.user?.username}`);
      }
    },
  });

  return (
    <AutocompleteProvider>
      {profile && (
        <EditModal<z.infer<typeof formInfoProfile>>
          open={!loadingProfile}
          onSubmit={async (values) => {
            return withDelay(() => updateProfileMutation.mutateAsync(values));
          }}
          formSchema={formInfoProfile}
          navigationRoute={`/${profile?.username}`}
          defaultValues={{
            description: profile?.description || "",
            concertsPlayed: profile?.concertsPlayed || "NOT_SPECIFIED",
            rehearsalsPerWeek: profile?.rehearsalsPerWeek || "NOT_SPECIFIED",
            practiceType: profile?.practiceType || "NOT_SPECIFIED",
            isLookingForBand: profile?.isLookingForBand ?? false,
            youtube: profile?.socialLinks.youtube || "",
            instagram: profile?.socialLinks.instagram || "",
            tiktok: profile?.socialLinks.tiktok || "",
            twitter: profile?.socialLinks.twitter || "",
            soundcloud: profile?.socialLinks.soundcloud || "",
          }}
          title="Modifier les infos"
          isSubmitting={updateProfileMutation.isPending || isDelaying}
        >
          <UpdateProfileInfoForm />
        </EditModal>
      )}
    </AutocompleteProvider>
  );
}
