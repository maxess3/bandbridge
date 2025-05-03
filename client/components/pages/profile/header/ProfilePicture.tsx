"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { TbCameraPlus } from "react-icons/tb";

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

	const IMG_PROFILE = (
		<Image
			width={300}
			height={300}
			src={src}
			alt={alt}
			className="object-cover h-full rounded-full shadow-xl"
		/>
	);

	return (
		<div className="w-56 h-56 flex rounded-full">
			{isOwner && session?.user?.username ? (
				<Link
					href={`/${session?.user.username}/edit/profile/picture`}
					className="rounded-full relative overflow-hidden group"
				>
					{IMG_PROFILE}
					{/* Overlay */}
					<span className="absolute rounded-full w-full h-full items-center justify-center z-50 top-0 right-0 hidden group-hover:flex">
						<span className="backdrop-blur-sm w-12 h-12 text-2xl inline-flex justify-center items-center rounded-full">
							<TbCameraPlus className="text-white/90" />
						</span>
					</span>
				</Link>
			) : (
				IMG_PROFILE
			)}
		</div>
	);
};
