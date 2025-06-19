"use client";

import { ViewModal } from "@/components/modal/ViewModal";
import { EditProfilePictureUploadModal } from "@/components/modal/EditProfilePictureUploadModal";
import { ProfilePictureForm } from "@/components/form/ProfilePictureForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/hooks/useProfile";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfile";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { Button } from "../ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTransitionDelay } from "@/hooks/useTransitionDelay";
import { useSession } from "next-auth/react";
import { useSessionLoader } from "@/contexts/SessionLoaderContext";

interface EditProfilePictureModalProps {
	onClose: () => void;
	open: boolean;
}

export function EditProfilePictureModal({
	onClose,
	open,
}: EditProfilePictureModalProps) {
	const { data: session, update } = useSession();
	const axiosAuth = useAxiosAuth();
	const { setIgnoreLoader } = useSessionLoader();
	const queryClient = useQueryClient();
	const { data: profile, isLoading: loadingProfile } = useProfile();
	const [showUploadModal, setShowUploadModal] = useState(false);
	const { isDelaying, withDelay } = useTransitionDelay(600);

	const deleteProfilePictureMutation = useMutation({
		mutationFn: async () => {
			const { data } = await axiosAuth.delete("/profile/me/picture");
			console.log(data);
			return data;
		},
		onSuccess: async (data) => {
			await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });

			setIgnoreLoader(true);
			await update({
				user: {
					...session?.user,
					profilePictureKey: data?.user?.profilePictureKey,
				},
			});
			setTimeout(() => setIgnoreLoader(false), 1000);

			onClose();
		},
	});

	const customFooter = (
		<div
			className={`w-full flex gap-2 ${
				profile?.profilePictureKey ? "justify-between" : "justify-end"
			}`}
		>
			{profile?.profilePictureKey && (
				<Button
					variant="outline"
					onClick={() =>
						withDelay(() => deleteProfilePictureMutation.mutateAsync())
					}
					disabled={deleteProfilePictureMutation.isPending || isDelaying}
					icon={<Trash2 className="w-4 h-4" />}
				>
					Supprimer la photo
					{deleteProfilePictureMutation.isPending || isDelaying ? (
						<Loader2 className="animate-spin" />
					) : null}
				</Button>
			)}
			<Button onClick={() => setShowUploadModal(true)}>
				Ajouter une photo
			</Button>
		</div>
	);

	return (
		<>
			{profile && (
				<>
					<ViewModal
						open={open && !loadingProfile}
						onClose={onClose}
						title="Photo de profil"
						footer={customFooter}
					>
						<ProfilePictureForm />
					</ViewModal>
					<EditProfilePictureUploadModal
						open={showUploadModal}
						onClose={() => setShowUploadModal(false)}
						onSuccess={onClose}
					/>
				</>
			)}
		</>
	);
}
