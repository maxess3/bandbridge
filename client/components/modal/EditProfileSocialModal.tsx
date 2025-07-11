"use client";

import { EditModalWithNavigation } from "@/components/modal/EditModalWithNavigation";
import { UpdateProfileSocialForm } from "@/components/form/UpdateProfileSocialForm";
import { formSocialProfile } from "@/lib/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/hooks/useProfile";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfile";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useTransitionDelay } from "@/hooks/useTransitionDelay";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { IoMdClose } from "react-icons/io";

export function EditProfileSocialModal() {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: loadingProfile } = useProfile();
  const { isDelaying, withDelay } = useTransitionDelay(600);

  const updateSocialFormMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSocialProfile>) => {
      const { data } = await axiosAuth.put("/profile/me/social", values);
      return data;
    },
    meta: { skipToast: true },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });

      if (data?.message) {
        toast.success(data.message, {
          action: {
            label: (
              <div className="w-9 h-9 hover:bg-hover rounded-full flex items-center justify-center">
                <IoMdClose className="text-xl" />
              </div>
            ),
            onClick: () => {},
          },
        });
      }

      if (window.history.length > 2) {
        router.back();
      } else {
        router.replace(`/${data?.user?.username}`);
      }
    },
  });

  return (
    <>
      {profile && (
        <EditModalWithNavigation
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
          <UpdateProfileSocialForm />
        </EditModalWithNavigation>
      )}
    </>
  );
}
