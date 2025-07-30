import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Profile } from "@/types/Profile";
import { ProfileTopActions } from "@/components/features/profile/resume/ProfileTopActions";

interface ProfileHeaderProps {
	profile: Profile;
	isOwner: boolean;
}

export const ProfileHeader = ({ profile, isOwner }: ProfileHeaderProps) => {
	return (
		<div className="pt-1 flex flex-wrap justify-between items-start gap-3">
			<div>
				<div className="text-2xl font-semibold">
					<span className="inline-flex items-center gap-x-1 flex-wrap">
						{profile?.firstName} {profile?.lastName}
						<RiVerifiedBadgeFill className="size-6" color="#4476ff" />
					</span>
				</div>
				<div className="text-lg font-medium opacity-80 w-fit">
					<span className="text-sm">@</span>
					{profile?.username}
				</div>
			</div>
			{!isOwner && <ProfileTopActions profile={profile} />}
		</div>
	);
};
