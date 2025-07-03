"use client";

import { Profile } from "@/types/Profile";
import { FollowButton } from "@/components/features/profile/components/buttons/FollowButton";
import { EditProfileButton } from "@/components/features/profile/components/buttons/EditProfileButton";
import { useSession } from "next-auth/react";

interface ProfileTopActionsProps {
	profile: Profile;
	isOwner: boolean;
}

export const ProfileTopActions = ({
	profile,
	isOwner,
}: ProfileTopActionsProps) => {
	const { data: session } = useSession();

	if (!session?.user) return null;

	return (
		<div className="flex items-center gap-x-2">
			{isOwner ? (
				<EditProfileButton username={session.user.username} />
			) : (
				<FollowButton profile={profile} />
			)}
		</div>
	);
};
