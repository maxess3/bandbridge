"use client";

import { Modal } from "@/components/Modal";
import { UpdateProfileForm } from "@/components/general/_partials/form/UpdateProfileForm";
import { formBasicInfoProfile } from "@/lib/schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useTransitionDelay } from "@/hooks/useTransitionDelay";
import { useRouter } from "next/navigation";
import { z } from "zod";

export default function Page() {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const { isDelaying, withDelay } = useTransitionDelay(500);

  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axiosAuth.get("/profile");
      return data;
    },
    refetchOnMount: false,
    staleTime: Infinity,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formBasicInfoProfile>) => {
      const { data } = await axiosAuth.put("/profile", values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setTimeout(() => {
        router.push("/me");
      }, 300);
    },
  });

  if (loadingProfile) {
    return <div>Chargement...</div>;
  }

  return (
    <Modal
      onSubmit={async (values) => {
        return withDelay(() => updateProfileMutation.mutateAsync(values));
      }}
      formSchema={formBasicInfoProfile}
      route="/me"
      defaultValues={{
        firstname: profile?.firstName ?? "",
        username: profile?.username ?? "",
        birthdate: {
          day: profile?.birthDate
            ? new Date(profile.birthDate).getDate().toString().padStart(2, "0")
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
        gender: profile?.gender || "Other",
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
  );
}
