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
import { toast } from "sonner";

interface EditProfilePictureModalProps {
	onClose: () => void;
	open: boolean;
}

export function EditProfilePictureModal({
	onClose,
	open,
}: EditProfilePictureModalProps) {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();
	const { data: profile, isLoading: loadingProfile } = useProfile();
	const [showUploadModal, setShowUploadModal] = useState(false);

	const deleteProfilePictureMutation = useMutation({
		mutationFn: async () => {
			const { data } = await axiosAuth.delete("/profile/me/picture");
			return data;
		},
		onSuccess: async (data) => {
			await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
			if (data?.message) {
				toast.success(data.message);
			}
			onClose();
		},
	});

	const customFooter = (
		<div className="w-full flex justify-between gap-2">
			<Button
				variant="outline"
				onClick={() => deleteProfilePictureMutation.mutate()}
				disabled={deleteProfilePictureMutation.isPending}
				icon={<Trash2 className="w-4 h-4" />}
			>
				Supprimer la photo
				{deleteProfilePictureMutation.isPending && (
					<Loader2 className="animate-spin" />
				)}
			</Button>
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
						onClose={() => {
							setShowUploadModal(false);
							onClose();
						}}
					/>
				</>
			)}
		</>
	);
}
