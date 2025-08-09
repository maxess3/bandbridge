"use client";

import { EditModal } from "@/components/shared/modals/EditModal";
import { UpdateProfileGeneralForm } from "@/components/features/profile/forms/UpdateProfileGeneralForm";
import { formGeneralProfile } from "@/lib/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/hooks/useProfile";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfile";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useTransitionDelay } from "@/hooks/useTransitionDelay";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSessionUpdate } from "@/hooks/useSessionUpdate";
import { z } from "zod";
import { AutocompleteProvider } from "@/contexts/AutocompleteContext";

export function EditProfileGeneralModal() {
	const router = useRouter();
	const { data: session } = useSession();
	const { updateSession } = useSessionUpdate();
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

			const usernameChanged =
				data?.user?.username &&
				session?.user?.username !== data?.user?.username;
			const firstnameChanged =
				data?.user?.firstName &&
				session?.user?.firstName !== data?.user?.firstName;
			const lastnameChanged =
				data?.user?.lastName &&
				session?.user?.lastName !== data?.user?.lastName;

			if (usernameChanged || firstnameChanged || lastnameChanged) {
				await updateSession({
					username: data?.user?.username,
					firstName: data?.user?.firstName,
					lastName: data?.user?.lastName,
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
						firstname: profile?.firstName ?? "",
						lastname: profile?.lastName ?? "",
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
