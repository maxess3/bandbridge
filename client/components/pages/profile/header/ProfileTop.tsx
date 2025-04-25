import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Profile } from "@/types/Profile";
import { ProfileTopActions } from "@/components/pages/profile/header/ProfileTopActions";

interface ProfileTopProps {
	profile: Profile;
	isOwner: boolean;
}

export const ProfileTop = ({ profile, isOwner }: ProfileTopProps) => {
	return (
		<div className="flex justify-between">
			<div className="flex flex-col">
				<span className="text-3xl gap-x-1.5 font-satoshi font-semibold inline-flex items-center">
					{profile?.firstName}
					<RiVerifiedBadgeFill size={"0.8em"} color="#3b6ffd" />
				</span>
				<span className="text-lg font-medium opacity-80">
					{profile?.username ? `@${profile?.username}` : ""}
				</span>
			</div>
			<ProfileTopActions profile={profile} isOwner={isOwner} />
		</div>
	);
};
