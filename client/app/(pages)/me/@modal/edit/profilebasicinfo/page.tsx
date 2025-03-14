"use client";

import { Modal } from "@/components/Modal";
import { UpdateProfileForm } from "@/components/general/_partials/form/UpdateProfileForm";
import { formBasicInfoProfile } from "@/lib/schema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { z } from "zod";

export default function Page() {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();

  const updateProfileMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formBasicInfoProfile>) => {
      const { data } = await axiosAuth.put("/profile", values);
      console.log(data);
      return data;
    },
    onSuccess: () => {
      router.push("/me");
    },
  });
  return (
    <Modal
      onSubmit={async (values) => {
        return updateProfileMutation.mutateAsync(values);
      }}
      formSchema={formBasicInfoProfile}
      route="/me"
      defaultValues={{
        gender: "Other",
        country: "France",
      }}
      title="Modifier le profil"
    >
      <UpdateProfileForm />
    </Modal>
  );
}
