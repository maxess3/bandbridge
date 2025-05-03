"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export const ProfilePicture = ({ src, alt }: { src: string; alt: string }) => {
	const { data: session } = useSession();

	if (!session?.user) return null;

	return (
		<div className="w-56 h-56 flex rounded-full overflow-hidden">
			<Link href={`/${session.user.username}/edit/profile/picture`}>
				<Image
					width={300}
					height={300}
					src={src}
					alt={alt}
					className="object-cover h-full shadow-xl"
				/>
			</Link>
		</div>
	);
};
