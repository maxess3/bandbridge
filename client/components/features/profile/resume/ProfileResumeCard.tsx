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
			<ProfilePicture
				isOwner={isOwner}
				src={profile?.profilePictureKey}
				alt="Photo de profil"
			/>
			<div className="relative p-6">
				<EditProfileButton
					isOwner={isOwner}
					url={`/${profile?.username}/edit/profile/general`}
				/>
				<div className="space-y-6">
					<ProfileHeader
						isOwner={isOwner}
						pseudonyme={profile?.pseudonyme}
						username={profile?.username}
						instruments={profile?.instruments}
						genres={profile?.genres}
					/>
					<ProfileBasicInfo
						city={profile?.city}
						zipCode={profile?.zipCode}
						age={profile?.age}
					/>

					<ProfileStatLinks
						followers={profile?.followers}
						following={profile?.following}
						username={profile?.username}
					/>
				</div>
			</div>
		</div>
	);
};
