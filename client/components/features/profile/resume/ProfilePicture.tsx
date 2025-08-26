"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import { EditProfilePictureModal } from "@/components/features/profile/modals/EditProfilePictureModal";
import { useFocusManager } from "@/contexts/FocusManagerContext";
import { getProfileImageUrl } from "@/utils/utils";

export const ProfilePicture = ({
	isOwner,
	src,
	alt,
}: {
	isOwner: boolean;
	src: string | null;
	alt: string;
}) => {
	const { captureFocus } = useFocusManager();
	const { data: session } = useSession();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const imageURL = getProfileImageUrl(src ?? "", "medium");

	const handleImageClick = () => {
		captureFocus();
		setIsModalOpen(true);
	};

	const IMG_PROFILE = (
		<span className="rounded-full">
			{imageURL ? (
				<Image
					src={imageURL}
					alt={alt}
					width={260}
					height={260}
					className="rounded-full border"
				/>
			) : null}
		</span>
	);

	return (
		<div className="flex">
			{isOwner && session?.user?.username ? (
				<button
					onClick={handleImageClick}
					aria-label="Modifier la photo de profil"
				>
					{IMG_PROFILE}
				</button>
			) : (
				IMG_PROFILE
			)}
			{isModalOpen && (
				<EditProfilePictureModal
					onClose={() => setIsModalOpen(false)}
					open={isModalOpen}
				/>
			)}
		</div>
	);
};
