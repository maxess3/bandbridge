"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DefaultProfilePicture } from "../icons/DefaultProfilePicture";
import { getProfileImageUrl } from "@/utils/utils";

interface ProfileCardProps {
	profile: {
		id: string;
		pseudonyme: string;
		profilePictureKey?: string;
		lastActiveAt?: string;
		user: {
			username: string;
			firstName: string;
			lastName: string;
		};
	};
	variant?: "follower" | "following" | "default";
}

export const ProfileCard = ({
	profile,
	variant = "default",
}: ProfileCardProps) => {
	const { pseudonyme, profilePictureKey, user } = profile;
	const { username } = user;
	const imageURL = getProfileImageUrl(profilePictureKey ?? "", "medium");

	return (
		<Link
			href={`/${username}`}
			className="block group"
			aria-label={`Voir le profil de ${pseudonyme}`}
		>
			<div className="p-4 rounded-lg border-2">
				<div className="flex items-center space-x-3">
					<Avatar className="h-12 w-12">
						<AvatarImage
							src={imageURL}
							alt={`Photo de profil de ${pseudonyme}`}
						/>
						<AvatarFallback>
							<DefaultProfilePicture />
						</AvatarFallback>
					</Avatar>

					<div className="flex-1 min-w-0">
						<div className="flex items-center space-x-2 mb-1">
							<h3 className="font-semibold truncate">{pseudonyme}</h3>
							{variant === "follower" && (
								<Badge variant="secondary" className="text-xs">
									Abonné
								</Badge>
							)}
							{variant === "following" && (
								<Badge variant="outline" className="text-xs">
									Suivi
								</Badge>
							)}
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};
