import { ProfilePicture } from "@/components/features/profile/components/header/ProfilePicture";
import { ProfileHeader } from "@/components/features/profile/components/header/ProfileHeader";
import { ProfileFollowStats } from "@/components/features/profile/components/header/ProfileFollowStats";
import { ProfileBasicInfo } from "@/components/features/profile/components/header/ProfileBasicInfo";
import { ProfileMusicInterests } from "@/components/features/profile/components/ProfileMusicInterests";
import { ProfileAside } from "@/components/features/profile/components/aside/ProfileAside";
import { Profile } from "@/types/Profile";

interface ProfileLayoutProps {
	isOwner?: boolean;
	profile: Profile;
}

export function ProfileLayout({
	isOwner = false,
	profile,
}: ProfileLayoutProps) {
	return (
		<div className="flex gap-3 p-3 w-full h-fit">
			<div className="w-2/3 flex flex-col gap-3">
				<div className="bg-[#111111] rounded-xl w-full border">
					<div className="w-full h-48 bg-gradient-to-r from-violet-600 to-indigo-600 relative rounded-t-xl">
						<ProfilePicture
							isOwner={isOwner}
							src={profile?.profilePictureKey}
							alt="Photo de profil"
						/>
					</div>
					<div className="flex w-full gap-x-6 px-6 pt-16 pb-6">
						<div className="flex flex-col w-full space-y-6">
							<ProfileHeader isOwner={isOwner} profile={profile} />
							<ProfileFollowStats
								followers={profile?.followers}
								following={profile?.following}
							/>
							<div className="space-y-2">
								<ProfileBasicInfo profile={profile} />
							</div>
						</div>
					</div>
				</div>
				<ProfileMusicInterests />
			</div>
			<ProfileAside profile={profile} isOwner={isOwner} />
			{/* <ProfileMusicInterests /> */}
		</div>
	);
}
