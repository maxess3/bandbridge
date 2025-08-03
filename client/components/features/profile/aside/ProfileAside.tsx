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
		<aside className="rounded-xl xl:w-[380px] lg:w-[350px] md:w-[300px] w-full">
			<div className="md:space-y-3 space-y-2">
				<ProfileMusicianInfos profile={profile} isOwner={isOwner} />
			</div>
		</aside>
	);
};
