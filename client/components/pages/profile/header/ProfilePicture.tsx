"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { EditProfilePictureModal } from "@/components/modal/EditProfilePictureModal";
import { useState } from "react";

export const ProfilePicture = ({
	isOwner,
	src,
	alt,
}: {
	isOwner: boolean;
	src: string;
	alt: string;
}) => {
	const { data: session } = useSession();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const defaultImage = "/profile_large.jpeg";

	const imageURL = src
		? `${process.env.NEXT_PUBLIC_R2_URL}/${src}`
		: defaultImage;

	const IMG_PROFILE = (
		<Image
			width={300}
			height={300}
			src={imageURL}
			alt={alt}
			className="object-cover h-full rounded-full shadow-xl"
		/>
	);

	return (
		<>
			<div className="w-52 h-52 flex rounded-full">
				{isOwner && session?.user?.username ? (
					<button
						onClick={() => setIsModalOpen(true)}
						className="rounded-full relative overflow-hidden group hover:opacity-90"
					>
						{IMG_PROFILE}
					</button>
				) : (
					IMG_PROFILE
				)}
			</div>
			{isModalOpen && (
				<EditProfilePictureModal
					onClose={() => setIsModalOpen(false)}
					open={isModalOpen}
				/>
			)}
		</>
	);
};
