"use client";

import { EditModalWithNavigation } from "@/components/modal/EditModalWithNavigation";
import { UpdateProfileInfoForm } from "@/components/form/UpdateProfileInfoForm";
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
import { toast } from "sonner";
import { IoMdClose } from "react-icons/io";

export function EditProfileInfoModal() {
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
				await updateSession({
					username: data?.user?.username,
					firstName: data?.user?.firstName,
				});
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
					defaultValues={{}}
					title="Modifier les infos"
					isSubmitting={updateProfileMutation.isPending || isDelaying}
				>
					<UpdateProfileInfoForm />
				</EditModalWithNavigation>
			)}
		</>
	);
}
