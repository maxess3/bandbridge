"use client";

import { Profile } from "@/types/Profile";
import { ProfileMusicianInfos } from "@/components/features/profile/aside/ProfileMusicianInfos";

export const ProfileAside = ({
	profile,
	isOwner,
}: {
	profile: Profile;
	isOwner: boolean;
}) => {
	return (
		<aside>
			<ProfileMusicianInfos profile={profile} isOwner={isOwner} />
		</aside>
	);
};
