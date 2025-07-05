"use client";

import { EditModalWithNavigation } from "@/components/shared/modals/EditModalWithNavigation";
import { UpdateProfileInfoForm } from "@/components/features/profile/forms/UpdateProfileInfoForm";
import { formInfoProfile } from "@/lib/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/hooks/useProfile";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfile";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useTransitionDelay } from "@/hooks/useTransitionDelay";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { IoMdClose } from "react-icons/io";

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
		meta: { skipToast: true },
		onSuccess: async (data) => {
			await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });

			if (data?.message) {
				console.log(data);
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
				router.push(`/${data?.user?.username}`);
			}
		},
	});

	return (
		<>
			{profile && (
				<EditModalWithNavigation
					open={!loadingProfile}
					onSubmit={async (values) => {
						console.log(values);
						return withDelay(() => updateProfileMutation.mutateAsync(values));
					}}
					formSchema={formInfoProfile}
					route={`/${profile?.username}`}
					defaultValues={{
						description: profile?.description || "",
						concertsPlayed: profile?.concertsPlayed || "NOT_SPECIFIED",
						rehearsalsPerWeek: profile?.rehearsalsPerWeek || "NOT_SPECIFIED",
						youtube: profile?.socialLinks.youtube || "",
						instagram: profile?.socialLinks.instagram || "",
						tiktok: profile?.socialLinks.tiktok || "",
						twitter: profile?.socialLinks.twitter || "",
						soundcloud: profile?.soundcloud || "",
					}}
					title="Modifier les infos"
					isSubmitting={updateProfileMutation.isPending || isDelaying}
				>
					<UpdateProfileInfoForm />
				</EditModalWithNavigation>
			)}
		</>
	);
}
