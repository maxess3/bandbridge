"use client";

import { Modal } from "@/components/modal/Modal";
import { LoadingModal } from "@/components/modal/LoadingModal";
import { UpdateSocialForm } from "@/components/general/_partials/form/UpdateSocialForm";
import { formSocialProfile } from "@/lib/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/hooks/useProfile";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfile";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useTransitionDelay } from "@/hooks/useTransitionDelay";
import { useRouter } from "next/navigation";
import { z } from "zod";

export function EditProfileSocialModal() {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: loadingProfile } = useProfile();
  const { isDelaying, withDelay } = useTransitionDelay(500);

  const updateSocialFormMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSocialProfile>) => {
      const { data } = await axiosAuth.put("/profile/me/social", values);
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
        title="Liens sociaux"
        open={loadingProfile}
      >
        Chargement...
      </LoadingModal>
      {profile && (
        <Modal
          open={!loadingProfile}
          onSubmit={async (values) => {
            return withDelay(() =>
              updateSocialFormMutation.mutateAsync(values)
            );
          }}
          formSchema={formSocialProfile}
          route={`/${profile?.username}`}
          defaultValues={{
            youtube: profile?.socialLinks.youtube ?? "",
            instagram: profile?.socialLinks.instagram ?? "",
            tiktok: profile?.socialLinks.tiktok ?? "",
            twitter: profile?.socialLinks.twitter ?? "",
            soundcloud: profile?.socialLinks.soundcloud ?? "",
          }}
          title="Liens sociaux"
          isSubmitting={updateSocialFormMutation.isPending || isDelaying}
        >
          <UpdateSocialForm />
        </Modal>
      )}
    </>
  );
}
