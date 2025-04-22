"use client";

import { Modal } from "@/components/modal/Modal";
import { LoadingModal } from "@/components/modal/LoadingModal";
import { UpdateProfileForm } from "@/components/general/_partials/form/UpdateProfileForm";
import { formGeneralProfile } from "@/lib/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/hooks/useProfile";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfile";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useTransitionDelay } from "@/hooks/useTransitionDelay";
import { useRouter } from "next/navigation";
import { z } from "zod";

export default function Page() {
  console.log("Intercepted route");
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: loadingProfile } = useProfile();
  const { isDelaying, withDelay } = useTransitionDelay(600);

  const updateProfileMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formGeneralProfile>) => {
      const { data } = await axiosAuth.put("/profile/me", values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      if (window.history.length > 2) {
        router.back();
      } else {
        router.push(`/${profile?.username}`);
      }
    },
  });

  return (
    <>
      <LoadingModal
        route={`/${profile?.username}`}
        title="Modifier le profil"
        open={loadingProfile}
      >
        Chargement...
      </LoadingModal>
      {profile && (
        <Modal
          open={!loadingProfile}
          onSubmit={async (values) => {
            return withDelay(() => updateProfileMutation.mutateAsync(values));
          }}
          formSchema={formGeneralProfile}
          route={`/${profile?.username}`}
          defaultValues={{
            firstname: profile?.firstName ?? "",
            username: profile?.username ?? "",
            birthdate: {
              day: profile?.birthDate
                ? new Date(profile.birthDate)
                    .getDate()
                    .toString()
                    .padStart(2, "0")
                : "",
              month: profile?.birthDate
                ? (new Date(profile.birthDate).getMonth() + 1)
                    .toString()
                    .padStart(2, "0")
                : "",
              year: profile?.birthDate
                ? new Date(profile.birthDate).getFullYear().toString()
                : "",
            },
            gender: profile?.gender || "OTHER",
            country: profile?.country || "France",
            zipcode: profile?.zipCode ?? "",
            city: profile?.city ?? "",
            formattedBirthdate: profile?.birthDate ?? "",
          }}
          title="Modifier le profil"
          isSubmitting={updateProfileMutation.isPending || isDelaying}
        >
          <UpdateProfileForm />
        </Modal>
      )}
    </>
  );
}
