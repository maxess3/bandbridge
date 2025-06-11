"use client";

import { EditModal } from "@/components/modal/EditModal";
import { UpdateProfilePictureForm } from "@/components/form/UpdateProfilePictureForm";
import { formProfilePicture } from "@/lib/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/hooks/useProfile";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfile";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useTransitionDelay } from "@/hooks/useTransitionDelay";
import { useSession } from "next-auth/react";
import { useSessionLoader } from "@/contexts/SessionLoaderContext";
import { z } from "zod";
import { toast } from "sonner";
import { IoMdClose } from "react-icons/io";

interface EditProfilePictureUploadModalProps {
	onClose: () => void;
	open: boolean;
}

export function EditProfilePictureUploadModal({
	onClose,
	open,
}: EditProfilePictureUploadModalProps) {
	const { data: session, update } = useSession();
	const { setIgnoreLoader } = useSessionLoader();
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();
	const { data: profile, isLoading: loadingProfile } = useProfile();
	const { isDelaying, withDelay } = useTransitionDelay(600);

	const updateProfilePictureMutation = useMutation({
		mutationFn: async (values: z.infer<typeof formProfilePicture>) => {
			console.log(values);
			const formData = new FormData();
			formData.append("file", values.profilePicture);

			const { data } = await axiosAuth.post("/profile/me/picture", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			return data;
		},
		meta: { skipToast: true },
		onSuccess: async (data) => {
			console.log(data);

			await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });

			if (data?.user?.profilePictureKey) {
				setIgnoreLoader(true);
				await update({
					user: {
						...session?.user,
						profilePictureKey: data?.user?.profilePictureKey,
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

			onClose();
		},
	});

	return (
		<>
			{profile && (
				<EditModal
					open={open && !loadingProfile}
					onClose={onClose}
					onSubmit={async (values) => {
						return withDelay(() =>
							updateProfilePictureMutation.mutateAsync(values)
						);
					}}
					formSchema={formProfilePicture}
					defaultValues={{}}
					title="Ajouter une photo de profil"
					isSubmitting={updateProfilePictureMutation.isPending || isDelaying}
					showOverlay={false}
				>
					<UpdateProfilePictureForm />
				</EditModal>
			)}
		</>
	);
}
