"use client";

import { Modal } from "@/components/Modal";
import { UpdateSocialLinksForm } from "@/components/general/_partials/form/UpdateSocialLinksForm";
import { formSocialProfile } from "@/lib/schema";
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

  const updateSocialFormMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSocialProfile>) => {
      const { data } = await axiosAuth.put("/profile/social-links", values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-social-links"] });
      setTimeout(() => {
        router.push("/me");
      }, 300);
    },
  });

  return (
    <Modal
      onSubmit={async (values) => {
        return withDelay(() => updateSocialFormMutation.mutateAsync(values));
      }}
      formSchema={formSocialProfile}
      route="/me"
      defaultValues={{}}
      title="Liens sociaux"
      isSubmitting={updateSocialFormMutation.isPending || isDelaying}
    >
      <UpdateSocialLinksForm />
    </Modal>
  );
}
