import { ProfilePicture } from "@/components/features/profile/components/header/ProfilePicture";
import { ProfileHeader } from "@/components/features/profile/components/header/ProfileHeader";
import { ProfileFollowStats } from "@/components/features/profile/components/header/ProfileFollowStats";
import { ProfileBasicInfo } from "@/components/features/profile/components/header/ProfileBasicInfo";
import { ProfileMusicInterests } from "@/components/features/profile/components/ProfileMusicInterests";
import { ProfileMusicianInfos } from "@/components/features/profile/components/ProfileMusicianInfos";
import { ProfileSidebar } from "@/components/features/profile/components/sidebar/ProfileSidebar";
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
		<div className="py-8 flex flex-col w-full">
			<div className="w-full flex gap-x-8">
				<div className="w-full max-w-[700px]">
					<div className="flex w-full gap-x-6">
						<div className="flex items-center">
							<ProfilePicture
								isOwner={isOwner}
								src={profile?.profilePictureKey}
								alt="Photo de profil"
							/>
						</div>
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
					<div className="mt-4 flex flex-col gap-y-3">
						<ProfileMusicInterests />
						<ProfileMusicianInfos profile={profile} />
					</div>
				</div>
				<ProfileSidebar profile={profile} isOwner={isOwner} />
			</div>
		</div>
	);
}
