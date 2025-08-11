"use client";

import { EditModal } from "@/components/shared/modals/EditModal";
import { UpdateProfileGeneralForm } from "@/components/features/profile/forms/UpdateProfileGeneralForm";
import { formGeneralProfile } from "@/lib/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/hooks/useProfile";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfile";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useTransitionDelay } from "@/hooks/useTransitionDelay";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { AutocompleteProvider } from "@/contexts/AutocompleteContext";

export function EditProfileGeneralModal() {
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
		onSuccess: async (data) => {
			console.log("data", data);
			await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });

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
					open={!loadingProfile}
					onSubmit={async (values) => {
						return withDelay(() => updateProfileMutation.mutateAsync(values));
					}}
					formSchema={formGeneralProfile}
					navigationRoute={`/${profile?.username}`}
					defaultValues={{
						country: profile?.country || "France",
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
									index: string
								) => ({
									instrumentTypeId: instrument.instrumentTypeId || "",
									level: instrument.level,
									order: instrument.order ?? index,
								})
							) || [],
						genres: profile?.genres || [],
					}}
					title="Modifier le résumé"
					isSubmitting={updateProfileMutation.isPending || isDelaying}
				>
					<UpdateProfileGeneralForm />
				</EditModal>
			)}
		</AutocompleteProvider>
	);
}
