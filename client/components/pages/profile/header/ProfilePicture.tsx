"use client";

import { useSession } from "next-auth/react";
import { EditProfilePictureModal } from "@/components/modal/EditProfilePictureModal";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PiUser } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { PiMusicNotesPlus } from "react-icons/pi";
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

	const imageURL = process.env.NEXT_PUBLIC_R2_URL + "/" + src;

	const IMG_PROFILE = (
		<Avatar className="w-48 h-48">
			<AvatarImage className="hover:opacity-90" src={imageURL} alt={alt} />
			<AvatarFallback>
				<PiUser size={58} />
			</AvatarFallback>
		</Avatar>
	);

	return (
		<div className="relative">
			<div className="w-52 h-52 flex rounded-full relative">
				{isOwner && session?.user?.username ? (
					<button
						onClick={() => setIsModalOpen(true)}
						className="rounded-full relative overflow-hidden group"
					>
						{IMG_PROFILE}
					</button>
				) : (
					IMG_PROFILE
				)}
				<Button
					variant={"outline"}
					className="bg-background absolute bottom-2 right-8 h-12 w-12 rounded-full"
				>
					<PiMusicNotesPlus style={{ width: "1.2em", height: "1.2em" }} />
				</Button>
			</div>
			{isModalOpen && (
				<EditProfilePictureModal
					onClose={() => setIsModalOpen(false)}
					open={isModalOpen}
				/>
			)}
		</div>
	);
};
