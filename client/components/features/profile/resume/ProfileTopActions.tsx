"use client";

import { Profile } from "@/types/Profile";
import { FollowButton } from "@/components/features/profile/buttons/FollowButton";
import { useSession } from "next-auth/react";

interface ProfileTopActionsProps {
	profile: Profile;
}

export const ProfileTopActions = ({ profile }: ProfileTopActionsProps) => {
	const { data: session } = useSession();

	if (!session?.user) return null;

	return (
		<div className="flex items-center gap-x-2">
			<FollowButton profile={profile} />
		</div>
	);
};
