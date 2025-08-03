import { Profile } from "@/types/Profile";
import { ProfilePicture } from "@/components/features/profile/resume/ProfilePicture";
import { EditProfileButton } from "@/components/features/profile/buttons/EditProfileButton";
import { ProfileHeader } from "@/components/features/profile/resume/ProfileHeader";
import { ProfileStatLinks } from "@/components/features/profile/resume/ProfileStatLinks";
import { ProfileBasicInfo } from "@/components/features/profile/resume/ProfileBasicInfo";

export const ProfileResumeCard = ({
	profile,
	isOwner,
}: {
	profile: Profile;
	isOwner: boolean;
}) => {
	return (
		<div className="w-full border rounded-xl">
			<div className="relative w-full lg:h-52 h-36 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-t-xl">
				<ProfilePicture
					isOwner={isOwner}
					src={profile?.profilePictureKey}
					alt="Photo de profil"
				/>
			</div>
			<div className="relative pt-16 px-6 pb-6">
				<EditProfileButton
					isOwner={isOwner}
					url={`/${profile?.username}/edit/profile/general`}
				/>
				<div className="space-y-6">
					<ProfileHeader
						isOwner={isOwner}
						firstName={profile?.firstName}
						lastName={profile?.lastName}
						username={profile?.username}
					/>
					<ProfileBasicInfo
						city={profile?.city}
						zipCode={profile?.zipCode}
						birthDate={profile?.birthDate}
					/>
					<ProfileStatLinks
						followers={profile?.followers}
						following={profile?.following}
					/>
				</div>
			</div>
		</div>
	);
};
