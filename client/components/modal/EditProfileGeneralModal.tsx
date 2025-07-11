"use client";

import { EditModalWithNavigation } from "@/components/modal/EditModalWithNavigation";
import { UpdateProfileGeneralForm } from "@/components/form/UpdateProfileGeneralForm";
import { formGeneralProfile } from "@/lib/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/hooks/useProfile";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfile";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useTransitionDelay } from "@/hooks/useTransitionDelay";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSessionLoader } from "@/contexts/SessionLoaderContext";
import { z } from "zod";
import { toast } from "sonner";
import { IoMdClose } from "react-icons/io";

export function EditProfileGeneralModal() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const { setIgnoreLoader } = useSessionLoader();
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: loadingProfile } = useProfile();
  const { isDelaying, withDelay } = useTransitionDelay(600);

  const updateProfileMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formGeneralProfile>) => {
      const { data } = await axiosAuth.put("/profile/me", values);
      return data;
    },
    meta: { skipToast: true },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });

      const usernameChanged =
        data?.user?.username &&
        session?.user?.username !== data?.user?.username;
      const firstnameChanged =
        data?.user?.firstName &&
        session?.user?.firstName !== data?.user?.firstName;

      if (usernameChanged || firstnameChanged) {
        setIgnoreLoader(true);
        await update({
          user: {
            ...session?.user,
            username: data?.user?.username,
            firstName: data?.user?.firstName,
          },
        });
        setTimeout(() => setIgnoreLoader(false), 1000);
      }

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

      if (usernameChanged) {
        router.push(`/${data?.user?.username}`);
      } else {
        if (window.history.length > 2) {
          router.back();
        } else {
          router.push(`/${data?.user?.username}`);
        }
      }
    },
  });

  return (
    <>
      {profile && (
        <EditModalWithNavigation
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
          <UpdateProfileGeneralForm />
        </EditModalWithNavigation>
      )}
    </>
  );
}
